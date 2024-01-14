/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/

import { bid, cid, rid } from "./Board.js";

/**
 * Find row y-wings and perform eliminations.
 *
 * The Y-wing technique is fully described at
 * https://sudoku.com/sudoku-rules/y-wing/
 *
 * Y-wing is a technique for finding complementary pairs of cells which
 * together with a pivot cell constrain a fourth cell.
 *
 * @param {Board} board board to analyse
 * @return {number} number of resulting fixes
 */
function yWing(board) {
  let fixes = 0;

  function intersection(s1, s2) {
    const is = [];
    for (const s1s of s1) {
      if (s2.indexOf(s1s) >= 0)
        is.push(s1s);
    }
    return is.join("");
  }

  // Examine each cell for potential pivots
  for (let pivotRow = 0; pivotRow < board.dim; pivotRow++) {
    for (let pivotCol = 0; pivotCol < board.dim; pivotCol++) {
      const pivotSyms = board.possibilities[pivotRow][pivotCol];
      if (pivotSyms.length === 2) {
        board.report(`Potential Y-wing pivot on "${pivotSyms}" at ${bid(pivotRow, pivotCol)}`);

        // Check the rest of the pivotRow for potential pincers
        const pincers = [];
        for (let pincerCol = 0; pincerCol < board.dim; pincerCol++) {
          if (pincerCol === pivotCol) continue;
          const colPincerSyms = board.possibilities[pivotRow][pincerCol];
          if (colPincerSyms.length === 2
              && intersection(pivotSyms, colPincerSyms).length === 1) {

            board.report(`\tPincer (same row) ${bid(pivotRow, pincerCol)} shares "${intersection(pivotSyms, colPincerSyms)}"`);
            pincers.push({ row: pivotRow, col: pincerCol });
          }
        }

        // Check the rest of the pivotCol for potential pincers
        for (let pincerRow = 0; pincerRow < board.dim; pincerRow++) {
          if (pincerRow === pivotRow) continue;
          const rowPincerSyms = board.possibilities[pincerRow][pivotCol];
          if (rowPincerSyms.length === 2
              && intersection(pivotSyms, rowPincerSyms).length === 1) {
            board.report(`\tPincer (same col) ${bid(pincerRow,pivotCol)} shares  "${intersection(pivotSyms, rowPincerSyms)}"`);
            pincers.push({ row: pincerRow, col: pivotCol });
          }
        }

        // Check the pivot areas for potential pincers
        for (const ai of board.rc2a[pivotRow][pivotCol]) {
          const area = board.areas[ai];
          for (const cell of area.cells) {
            if (cell.row === pivotRow && cell.col === pivotCol) continue;
            const areaPincerSyms = board.possibilities[cell.row][cell.col];
            if (areaPincerSyms.length === 2
                && intersection(pivotSyms, areaPincerSyms).length === 1) {
              board.report(`\tPincer (same area ${area.id}) ${bid(cell.row, cell.col)} shares "${intersection(pivotSyms, areaPincerSyms)}"`);
              pincers.push({ row: cell.row, col: cell.col });
            }
          }
        }

        // If the pivot has syms AB, then one pincer has to have AC and the
        // other BC, where C is another sym. We know all potential pincers
        // meet the first of these constraints.
        // For each pincer, see if there's another pincer that meets the
        // second constraint.
        for (let i = 0; i < pincers.length - 1; i++) {
          // i is the first pincer
          const iRow = pincers[i].row, iCol = pincers[i].col;
          const iSyms = board.possibilities[iRow][iCol];
          for (let j = i + 1; j < pincers.length; j++) {
            // j is the second pincer
            const jRow = pincers[j].row, jCol = pincers[j].col;

            // The pincers can't be on the same row or column, or in the
            // same area
            if (jRow === iRow || jCol === iCol) continue;

            const jSyms = board.possibilities[jRow][jCol];

            // We know the pincers each only share one sym with the pivot.
            // Make sure the other sym is shared between the pincers,
            // they are not identical, and the shared sym is not on
            // the pivot.
            const is = intersection(iSyms, jSyms);
            if (is.length !== 1 || intersection(is, pivotSyms) > 0) continue;

            board.report(`\tPincers at ${bid(iRow,iCol)} "${iSyms}" and ${bid(jRow,jCol)} "${jSyms}" share "${is}"`);

            // Eliminate intersecting symbols from cells that interact
            // with both i and j i.e. are on the same row, same
            // column, or in the same area.
            for (let row = 0; row < board.dim; row++) {
              for (let col = 0; col < board.dim; col++) {
                if (row === iRow && col === iCol
                    || row === jRow && col === jCol
                    || row === pivotRow && col === pivotCol) continue;

                if (board.interact(iRow, iCol, row, col)
                    && board.interact(jRow, jCol, row, col)) {
                  for (const sym of intersection(iSyms, jSyms)) {
                    if (board.couldBe(sym, row, col)) {
                      board.report(`\tEliminate "${sym}" from ${bid(row, col)}`);
                      fixes += board.cantBeInCell(sym, row, col);
                      //console.debug(board.savePossibilities());
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return fixes;
}

export { yWing }
