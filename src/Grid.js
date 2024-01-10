import { Board } from "./Board.js";
/**
 * A visual representation of a board
 */
class Grid extends Board {

  /**
   * Construct a new board in the given jQuery container
   * @param {JObject?} board or undefined to generate a new board div
   */
  constructor(dim, $board) {
    super(dim);

    /**
     * jQuery object (a div) representing the board
     * @member {JObject}
     */
    this.$board = $board || $("<div></div>");

    /**
     * Tiles (numbers) that are on the board.
     * @member {Tile?[][]}
     */
    this.tiles = undefined;
  }

    /**
   * Populate the board for Slidoku. This is a fully populated board with a
   * single "slidable tile" and a number of fixed Tiles that specify
   * the starting condition for the puzzle.
   * When a board is read (or created) it will be populated with a number
   * of "fixed" Tiles specifying the initial board condition. This method
   * fills in the gaps so that *all* cells are populated with Tiles. The
   * board so generated is *not* known to be a solution to the puzzle!
   */
  makeSlidoku() {
    const board = this;
    // Determine the total population of symbols required
    let symbols = [];
    for (let i = 0; i < this.dim * this.dim; i++)
      symbols += this.symbols[i % this.symbols.length];

    // Eliminate known possibilities
    for (let row = 0; row < this.dim; row++) {
      for (let col = 0; col < this.dim; col++) {
        const poss = this.possibilities[row][col];
        if (poss.length === 1) {
          const i = symbols.indexOf(poss.charAt(0));
          if (i < 0)
            throw new Error(`Unexpected symbol ${poss.charAt(0)} at (${row},${col})`);
          symbols.splice(i, 1);
        }
      }
    }

    // Populate the board with unfixed possibilities where there is no existing
    // fixed tile
    for (let row = 0; row < this.dim; row++) {
      for (let col = 0; col < this.dim; col++) {
        if (this.tiles[row][col])
          continue;
        let tile = new Tile(symbols.shift(), row, col);
        this.tiles[row][col] = tile;
        this.$board.append(tile.$tile);
        // When a tile is clicked, slide it into the adjacent "space"
        tile.$tile.on("click", function() {
          const tile = $(this).data("Tile");
          const etile = $(".empty").data("Tile");
          if (!tile.fixed && tile !== etile && tile.adjacentTo(etile)) {
            board.exchange(tile, etile);
            // exchange() doesn't update(), so do it now
            tile.update(); etile.update();
          }
        });
        tile.update();
      }
    }

    // The board is fully populated with tiles
    // Pick one unfixed tile to be empty
    let t;
    do {
      t = this.tiles[Math.floor(Math.random() * this.dim)]
      [Math.floor(Math.random() * this.dim)];
    } while (t.fixed);
    t.empty = true;
  }

  /**
   * Swap two actuals. Note this does not update the visual representation
   * of the actuals, as it is used when shuffling the board.
   * @param {Tile} a
   * @param {Tile} b
   */
  exchange(a, b) {
    // Update mapping
    this.actuals[a.row][a.col] = b;
    this.actuals[b.row][b.col] = a;
    const tmp = a.cell;
    a.cell = b.cell;
    b.cell = tmp;

    const p = this.possibilities[b.row][b.col];
    this.possibilities[b.row][b.col] = this.possibilities[a.row][a.col];
    this.possibilities[a.row][a.col] = p;
  }

  /**
   * Get the tile (if any) at position
   * @param {number|Cell} row row, or a Cell
   * @param {number?} col column, ignored if row is object
   * @return {Tile?} tile at that position
   */
  tileAt(row, col) {
    if (typeof row === "object")
      return this.actuals[row.row][row.col];
    return this.actuals[row][col];
  }

  /**
   * Randomly shuffle the board, respecting fixed actuals
   */
  shuffle() {
    let moves = this.dim * this.dim;
    while (moves-- > 0) {
      let tilea;
      do {
        tilea = this.actuals[Math.floor(Math.random() * this.dim)]
        [Math.floor(Math.random() * this.dim)];
      } while (!tilea || tilea.fixed);
      let tileb = tilea;
      while (!tileb || tileb === tilea || tileb.fixed) {
        tileb = this.actuals[Math.floor(Math.random() * this.dim)]
        [Math.floor(Math.random() * this.dim)];
      }
      this.exchange(tilea, tileb);
    }
    // exchange() doesn't update(), so do it now
    for (const row of this.actuals)
      for (const tile of row)
        if (tile) tile.update();
  }


}

export { Grid }
