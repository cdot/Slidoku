/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License MIT. See README.md at the root of this distribution for full copyright
  and license information.*/
/**
 * Methods to find naked and hidden singles.
 * Singles are where a cell is constrained to a single symbol as
 * a result of fixing.
 */
class Singles {

  /**
   * For each row, see if a symbol is only possible in one column
   * If so, fix it in that cell.
   * @param {Board} board to study
   * @return {number} number of cells fixed this way
   */
  static row(board) {
    let fixes = 0;
    const symCols = {};
    for (let row = 0; row < board.dim; row++) {
      // build a map from symbol to column
      const symCols = {};
      for (let col = 0; col < board.dim; col++) {
        const maybes = board.possibilities[row][col];
        if (maybes.length > 1) {
          for (const sym of maybes) {
            if (typeof symCols[sym] === "undefined")
              symCols[sym] = col;
            else
              symCols[sym] = "USELESS";
          }
        }
      }
      for (const sym in symCols) {
        if (typeof symCols[sym] === "number") {
          // sym was only found in one column
          fixes += board.fix(sym, row, symCols[sym]);
        }
      }
    }
    return fixes;
  }

  /**
   * For each column, see if a symbol is only possible in one row.
   * If so, fix it in that cell.
   * @param {Board} board to study
   * @return {number} number of cells fixed board way
   */
  static column(board) {
    let fixes = 0;
    const symRows = {};
    for (let col = 0; col < board.dim; col++) {
      // build a map from symbol to column
      const symRows = {};
      for (let row = 0; row < board.dim; row++) {
        const maybes = board.possibilities[row][col];
        if (maybes.length > 1) {
          for (const sym of maybes) {
            if (typeof symRows[sym] === "undefined")
              symRows[sym] = row;
            else
              symRows[sym] = "USELESS";
          }
        }
      }
      for (const sym in symRows) {
        if (typeof symRows[sym] === "number") {
          // sym was only found in one column
          fixes += board.fix(sym, symRows[sym], col);
        }
      }
    }
    return fixes;
  }

  /**
   * For each area, see if a symbol is only possible on a single row
   * or column within that area. If so, eliminate it from the rest of
   * the row/col outside the area.
   * @param {Board} board to study
   * @return {number} number of cells fixed board way
   */
  static area(board) {
    let fixes = 0;
    for (const area of board.areas) {

      // Build maps from symbols to the rows/cols they occur on
      const symRows = {};
      const symCols = {};
      for (const cell of area.cells) {
        const maybes = board.possibilities[cell.row][cell.col];
        // If there's only one possibility for the cell, it's already
        // been determined.
        if (maybes.length > 1) {
          for (const sym of maybes) {
            if (typeof symRows[sym] === "undefined")
              symRows[sym] = cell.row;
            else if (symRows[sym] !== cell.row)
              symRows[sym] = "USELESS"; // possible on more than one row

            if (typeof symCols[sym] === "undefined")
              symCols[sym] = cell.col;
            else if (symCols[sym] !== cell.col)
              symCols[sym] = "USELESS"; // possible on more than one col
          }
        }
      }

      for (const sym in symRows) {
        if (typeof symRows[sym] === "number") {
          for (let col = 0; col < board.dim; col++) {
            if (board.couldBe(sym, symRows[sym], col)
                && !area.contains(symRows[sym], col)) {
              board.report(`Area ${area.id} singles (row) rules out "${sym}" in (${symRows[sym]},${col})`);
              fixes += board.cantBeInCell(sym, symRows[sym], col);
            }
          }
        }
        if (typeof symCols[sym] === "number") {
          for (let row = 0; row < board.dim; row++) {
            if (board.couldBe(sym, row, symCols[sym])
                && !area.contains(row, symCols[sym])) {
              board.report(`Area ${area.id} singles (col) rules out ${sym} in (${row},${symCols[sym]})`);
              fixes += board.cantBeInCell(sym, row, symCols[sym]);
            }
          }
        }
      }
    }
    return fixes;
  }
}

export { Singles }
