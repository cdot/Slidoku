/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/

/**
 * A cell is a location on a board
 */
class Cell {

  /**
   * Size of a cell (W and H) in pixels.
   */
  static PX = 50;

  constructor(row, col) {
    /**
     * The row the cell is on
     * @member {number}
     */
    this.row = row;
    /**
     * The column the cell is on
     * @member {number}
     */
    this.col = col;
  }

  /**
   * Determine if this cell is immediately adjacent to another
   * @param {Cell} other the other cell
   */
  adjacentTo(other) {
    return (this.row === other.row && (this.col + 1 === other.col || this.col - 1 === other.col)) ||
    (this.col === other.col && (this.row + 1 === other.row || this.row - 1 === other.row));
  }
}

export {Cell };
