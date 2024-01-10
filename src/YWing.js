/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/

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

  for (let pivotRow = 0; pivotRow < board.dim; pivotRow++) {
    for (let pivotCol = 0; pivotCol < board.dim; pivotCol++) {
      const pivotSyms = board.possibilities[pivotRow][pivotCol];
      if (pivotSyms.length === 2) {
        board.report(`Y-wing pivot on "${pivotSyms}" at (${pivotRow},${pivotCol})`);
        // (pivotRow,pivotCol) is a pivot
        // check the rest of the pivotRow for a pincer
        for (let pincerCol = 0; pincerCol < board.dim; pincerCol++) {
          if (pincerCol === pivotCol) continue;
          const colPincerSyms = board.possibilities[pivotRow][pincerCol];
          if (colPincerSyms.length === 2 && intersection(pivotSyms, colPincerSyms).length > 0) {
            board.report(`\tPincer col ${pincerCol} (shared sym ${intersection(pivotSyms, colPincerSyms)})`);
            // Pincer found, check the rest of the col
            for (let pincerRow = 0; pincerRow < board.dim; pincerRow++) {
              if (pincerRow === pivotRow) continue;
              const rowPincerSyms = board.possibilities[pincerRow][pivotCol];
              if (rowPincerSyms.length === 2 && intersection(pivotSyms, rowPincerSyms).length > 0) {
                board.report(`\tPincer row ${pincerRow} (shared sym "${intersection(pivotSyms, rowPincerSyms)}")`);
                for (const sym of intersection(rowPincerSyms, colPincerSyms)) {
                  board.report(`\tFix "${sym}" to (${pincerRow},${pincerCol})`);
                  fixes += board.cantBeInCell(sym, pincerRow, pincerCol);
                }
              }
            }
          }
        }
        // Check the areas the pivot is in?
      }
    }
  }
  return fixes;
}

export { yWing }
