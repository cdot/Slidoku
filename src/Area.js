/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/

/**
 * An arbitrary shaped area within the board. Cells in an area need
 * not be contiguous, the point is to express a set of cells within which a
 * constraint applies. The standard constraint is that all the "Sudoku
 * numbers" must be present in the area, once and once only.
 * - Areas may be any size from 2 cells up to N.
 * - Areas may overlap (a cell may be in more than one area)
 * - TODO specify a different constraint for Areas e.g. sum of the numbers
 * in the area. 
 */
class Area {
  constructor(id) {
    /**
     * Identifier for the area
     * @member {number}
     */
    this.id = id;

    /**
     * Cells in the area. Each cell has {row, col}
     * @member {object[]}
     */
    this.cells = [];
  }

  /**
   * Add a cell to the area.
   * @param {number} row the row the cell is in
   * @param {number} col the column the cell is in
   * @param {number?} col the column the cell is in
   */
  addCell(row, col) {
    // Skip duplicates
    if (this.contains(row, col))
      return;
    this.cells.push({ row: row, col: col });
  }

  /**
   * Determine if the area contains the given cell
   * @param {number} row cell row
   * @param {number} col cell col
   * @return true if the cell is in the area
   */
  contains(row, col) {
    return this.cells.find(c => (c.row === row && c.col === col));
  }

  /**
   * Establish if the possibilities in the cells in the area conform to the
   * Sudoku constraint.
   * - TODO specify a different constraint for Areas e.g. sum of the numbers
   * in the area. 
   * @param {Board} board the board containing the area
   * @return {boolean} true if the constraint is satisfied
   */
  isSolved(board) {
    let symbols = "";
    if (this.cells.length !== board.dim)
      throw new Error(`Area ${this.id} is the wrong size (${this.cells.length}) for the sudoku constraint`);
    for (const cell of this.cells) {
      const poss = board.possibilities[cell.row][cell.col];
      if (poss.length !== 1)
        return false; // not fixed
      if (symbols.indexOf(poss) >= 0)
        return false; // not unique
      symbols += poss;
    }
    return true;
  }
}

export { Area };
