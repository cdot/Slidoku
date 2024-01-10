/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import { Cell } from "./Cell.js";

/**
 * A tile is a visual representation of a symbol placed into a board.
 */
class Tile {

  /**
   * Tiles are placed into cells.
   * @param {number} symbol the symbol in the tile
   * @param {(number|Cell)?} row the row to place the tile, or the cell,
   * or undefined to leave the tile unplaced.
   * @param {number?} col requires if typeof row === "number"   
   */
  constructor(symbol, row, col) {
    /**
     * The symbol on this tile. In traditional Sudoku this is a digit between
     * 1 and 9, but we abstract that to allow an arbitrary unicode character.
     * @member {string}
     */
    this.symbol = symbol;

    /**
     * True if the tile is fixed to the board
     * @member{boolean}
     */
    this.fixed = false;

    /**
     * jQuery object for this tile
     * @member {jQuery}
     */
    this.$tile = $("<div></div>")
    .addClass("tile")
    .css({ height : `${Cell.PX}px`, width: `${Cell.PX}px` })
    .css("font-size", `${Cell.PX / 2}px`)
    .data("Tile", this)
    .text(this.symbol);

    /**
     * The position at which the tile is placed
     * @member {Cell}
     * @private
     */
    if (typeof row === "number")
      this._cell = new Cell(row, col);
    else if (row instanceof Cell)
      this._cell = row;
    else
      this._cell = undefined;
  }

  /**
   * Set the position of the tile on the board
   * @param {Cell?} cell the cell to move to
   * @return the cell. or undefined if unset
   */
  set cell(cell) {
    this._cell = cell;
    return this._cell;
  }

  /**
   * Get the position of the tile on the board
   * @return {Cell?} current cell where the tile is placed or
   * undefined if it's not placed.
   */
  get cell() {
    return this._cell;
  }

  /**
   * Determine if this tile is immediately adjacent to another
   * @param {Tile} other the other tile
   */
  adjacentTo(other) {
    const t = this.cell, o = other.cell;
    if (!t || !o)
      return false;
    return t.adjacentTo(o);
  }

  /**
   * Update the visual representation of the tile
   */
  update() {
    const c = this.cell; // is it placed on the board?
    if (this.fixed)
      this.$tile.addClass("fixed");
    else
      this.$tile.removeClass("fixed");
    if (this.empty)
      this.$tile.addClass("empty");
    else
      this.$tile.removeClass("empty");
    if (c) {
      this.$tile
      .css({ top: `${c.row * Cell.PX}px`, left: `${c.col * Cell.PX}px` })
      .show();
    } else
      this.$tile.hide();
  }
}

export { Tile };
