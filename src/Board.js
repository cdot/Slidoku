/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License MIT. See README.md at the root of this distribution for full copyright
  and license information.*/
import { Area } from "./Area.js";
import { MatrixReader } from "./MatrixReader.js";

/**
 * A board is:
 * - an NxN array of cells, each of which has a set of possible
 * symbols that can go in that cell.
 * - a list of Areas, each of which is a list of cells included in
 * the area.
 * - an NxN map from cell to the list of areas that cell is contained in.
 */
class Board {

  /**
   * Construct a new board, either from a set of symbols or by cloning
   * another board.
   * @param {string} symbols symbols used to fill
   * in the puzzle, defaults to "123456789".
   */
  constructor(symbols = "123456789") {

    /**
     * Dimension of the (square) board
     * @member {number}
     */
    this.dim = symbols.length;

    /**
     * Symbols that are used in the board (usually 1..9)
     * @member {string}
     */
    this.symbols = symbols;

    /**
     * List of the areas on the board where the Sudoku constraint applies.
     * Areas may overlap (killer!)
     * @member {Area[]}
     */
    this.areas = [];

    /**
     * A list of possible symbols for each cell, indexed on row,col
     * @member {string[][][]}
     * @private
     */
    this.possibilities = new Array(this.dim);

    /**
     * Mapping from row,column to a list of area indexes that the
     * cell at row,column is part of.
     * @member {number?[][]}
     */
    this.rc2a = new Array(this.dim);

    for (let row = 0; row < this.dim; row++) {
      this.possibilities[row] = new Array(this.dim);
      this.rc2a[row] = new Array(this.dim);
      for (let col = 0; col < this.dim; col++) {
        // No areas yet
        this.rc2a[row][col] = [];
        // Anything is possible
        this.possibilities[row][col] = symbols;
      }
    }

    /**
     * Enable verbose debugging print for debugging. Override by
     * setting to console.debug.
     * @member {boolean}
     */
    this.report = () => {};
  }

  /**
   * Deep clone another board.
   * @param {Board} board the board to clone.
   * @return {Board} a new board that is an exact copy of board
   */
  static clone(board) {
    const newBoard = new Board(board.symbols);
    for (let row = 0; row < newBoard.dim; row++) {
      for (let col = 0; col < newBoard.dim; col++) {
        newBoard.rc2a[row][col] = board.rc2a[row][col];
        newBoard.possibilities[row][col] = board.possibilities[row][col];
      }
      newBoard.areas = [];
      for (const a of board.areas) {
        const ca = new Area(a.id);
        for (const c of a.cells) {
          ca.addCell(c.row, c.col);
        }
        newBoard.areas.push(ca);
      }
    }
    return newBoard;
  }

  /**
   * Make a transpose of this board
   * @return {Board} the transposed board
   */
  transposed() {
    const board = new Board(this.symbols);
    for (let row = 0; row < board.dim; row++) {
      for (let col = 0; col < board.dim; col++) {
        board.rc2a[row][col] = this.rc2a[col][row];
        board.possibilities[row][col] = this.possibilities[col][row];
      }
      board.areas = [];
      for (const a of this.areas) {
        const ca = new Area(a.id);
        for (const c of a.cells) {
          ca.addCell(c.col, c.row);
        }
        board.areas.push(ca);
      }
    }
    return board;
  }

  /**
   * Determine if the given symbol is a possible solution for the
   * given cell.
   * @param {string} sym symbol to check
   * @param {number} row row of cell
   * @param {number} col column of cell
   * @return {boolean} true if the symbol is possible in the cell
   */
  couldBe(sym, row, col) {
    const poss = this.possibilities[row][col];
    return poss.indexOf(sym) >= 0;
  }

  /**
   * Eliminate the given symbol as a possible solution for the
   * given cell. If the cell is left with only one possibility,
   * fix() it.
   * @param {string} sym symbol to eliminate
   * @param {number} row row of cell
   * @param {number} col column of cell
   * @return {number} the total number of cells that were fixed as a
   * result of this call.
   */
  cantBeInCell(sym, row, col) {
    const poss = this.possibilities[row][col];
    if (poss.length === 1) {
      if (poss === sym && this.report)
        throw new Error(`Insoluble; (${row},${col}) was set to ${this.possibilities[row][col]}, but now being told it can't be that`);
      return 0; // already fixed
    }
    let fixes = 0;
    const s = poss.replace(sym, "");
    if (s != poss) {
      this.report(`\t\tRemoved "${sym}" from (${row},${col})`);
      if (s.length === 1)
        fixes += this.fix(s, row, col);
      else
        // Not a fix, just an elimination
        this.possibilities[row][col] = s;
    }
    return fixes;
  }

  /**
   * Eliminate the given symbol as a possible solution for all
   * the cells in a row, except cells in not.
   * @param {string} sym symbol to eliminate
   * @param {number} col column
   * @param {number[]} keep cells not to eliminate the symbol from
   * @return {number} the total number of cells that were fixed as a
   * result of this call.
   */
  cantBeInRow(sym, row, keep) {
    let fixes = 0;
    for (let cn = 0; cn < this.dim; cn++)
      if (keep.indexOf(cn) < 0)
        fixes += this.cantBeInCell(sym, row, cn);
    return fixes;
  }

  /**
   * Eliminate the given symbol as a possible solution for all
   * the cells in a row, except cells in not.
   * @param {string} sym symbol to eliminate
   * @param {number} col column
   * @param {number[]} keep cells not to eliminate the symbol from
   * @return {number} the total number of cells that were fixed as a
   * result of this call.
   */
  cantBeInColumn(sym, col, keep) {
    let fixes = 0;
    for (let rn = 0; rn < this.dim; rn++)
      if (keep.indexOf(rn) < 0)
        fixes += this.cantBeInCell(sym, rn, col);
    return fixes;
  }

  /**
   * Eliminate the given symbol as a possible solution for all
   * the cells in a row, except cells in not.
   * @param {string} sym symbol to eliminate
   * @param {number} area area number
   * @param {number[]} keep cells not to eliminate the symbol from
   * @return {number} the total number of cells that were fixed as a
   * result of this call.
   */
  cantBeInArea(sym, area, keep) {
    let fixes = 0;
    const a = this.areas[area];
    for (let cn = 0; cn < a.cells.length; cn++)
      if (keep.indexOf(cn) < 0)
        fixes += this.cantBeInCell(sym, a.cells[cn].row, a.cells[cn].col);
    return fixes;
  }

  /**
   * Fix a symbol at the given location.
   * This will rule out the symbol elsewhere in the same row, column,
   * and each area the (row,col) is in. If the fix result
   * in a single legal symbol for a cell, then fix it recursively.
   * @param {string} sym the symbol to put in this cell
   * @param {number} row row of cell
   * @param {number} col column of cell
   * @return {number} number of cells fixed as a result of this fix
   */
  fix(sym, row, col) {
    if (!this.couldBe(sym, row, col))
      throw new Error(`Fixing "${sym}" to (${row},${col}) not possible, as it is has "${this.possibilities[row][col]}"`);

    if (this.possibilities[row][col].length === 1)
      return 0; // no fix necessary

    this.report(`Fix "${sym}" to (${row},${col}) {`);

    // Only one remaining possibility
    this.possibilities[row][col] = sym;

    let fixes = 1;

    // Eliminate from rest of this row
    this.report(`\tEliminate "${sym}" from row ${row} except (${row},${col})`);
    fixes += this.cantBeInRow(sym, row, [ col ]);
    //this.report(this.savePossibilities());

    // Eliminate from rest of this col
    this.report(`\tEliminate "${sym}" from column ${col} except (${row},${col})`);
    fixes += this.cantBeInColumn(sym, col, [ row ]);
    //this.report(this.savePossibilities());

    // Eliminate from rest of containing areas
    for (const ai of this.rc2a[row][col]) {
      this.report(`\tEliminate "${sym}" from area ${ai} except (${row},${col})`);
      for (const c of this.areas[ai].cells)
        if (!(c.row === row && c.col == col))
          fixes += this.cantBeInCell(sym, c.row, c.col);
      //this.report(this.savePossibilities());
    }
    this.report(`} fixed "${sym}" to (${row},${col})`);
    return fixes;
  }

  /**
   * Determine if the given row observes the Sudoku constraint
   * There must be a tile on each cell in the row.
   * @param {number} row the row to check
   * @return {boolean} true if constraints are satisfied
   */
  rowIsSolved(row) {
    let s = "";
    for (let col = 0; col < this.dim; col++) {
      const t = this.possibilities[row][col];
      if (t.length !== 1)
        return false;
      for (const sym of t) {
        if (s.indexOf(sym) >= 0)
          return false; // duplicate
        s += sym;
      }
    }
    return true;
  }

  /**
   * Determine if the given column observes the Sudoku constraint.
   * There must be a tile on each cell in the column.
   * @param {number} row the column to check
   * @return {boolean} true if constraints are satisfied
   */
  columnIsSolved(col) {
    let s = "";
    for (let row = 0; row < this.dim; row++) {
      const t = this.possibilities[row][col];
      if (t.length !== 1)
        return false;
      for (const sym of t) {
        if (s.indexOf(sym) >= 0)
          return false; // duplicate
        s += sym;
      }
    }
    return true;
  }

  /**
   * Check if the board meets sudoku criteria for a solution.
   * @return <boolean} true if the board is solved
   */
  isSolved() {
    for (let i = 0; i < this.dim; i++) {
      if (!this.rowIsSolved(i)) {
        //this.report(`Row ${i} is not solved`);
        return false;
      }

      if (!this.columnIsSolved(i)) {
        //this.report(`Column ${i} is not solved`);
        return false;
      }
    }
    for (const area of this.areas) {
      if (!area.isSolved(this)) {
        //this.report(`Area ${area.id} is not solved`);
        return false;
      }
    }
    return true;
  }

  /**
   * Read formatted setup data from a string.
   * The string is comprised of an (optional) single line containing a
   * set of symbols that are used when filling in the board, and two
   * square "pictures" of the board, the first giving the areas within
   * which constraints apply. The second gives the initial state of
   * the puzzle. A line starting with a hash "#" is treated as a
   * comment.  Example:
   * ```
   * # Symbols (optional)
   * 123456789
   * # Areas
   * |0|0|0|0|1|1|1|2|2|
   * |0|3|0|1|1|2|2|2|2|
   * |3|3|0|1|1|4|2|5|2|
   * |3|0|0|1|1|4|2|5|5|
   * |3|3|4|4|4|4|4|5|5|
   * |3|3|6|4|7|7|8|8|5|
   * |6|3|6|4|7|7|8|5|5|
   * |6|6|6|6|7|7|8|5|8|
   * |6|6|7|7|7|8|8|8|8|
   * 
   * # Initial board
   * | | | |4| |2|6|7| |
   * | |9| |7|5| |1| | |
   * |6| | | | |4| | | |
   * |5| | | | | | |3| |
   * | | | | | | | | | |
   * | |8| | | | | | |1|
   * | | | |3| | | | |7|
   * | | |2| |1|3| |6| |
   * | |5|4|2| |6| | | |
   * ```
   * This specifies a 9x9 sudoku. Each area within the board is assigned a 
   * unique number, and the first block used to define those areas.
   * The second block gives the initial state of the puzzle, with spaces
   * where numbers are unknown.
   * @param {string} s the board, as described
   * @param {boolean?} set true to make the process noisy
   * @return {Board} board (or a subclass) as loaded
   */
  static loadPuzzle(s, verbose) {
    const reader = new MatrixReader(s);

    const l = reader.nextLine();

    // Read symbols (if there are any) to establish dim
    // (there must be dim symbols)
    let symbols;
    if (/^\|.*\|$/.test(l)) {
      // Line looks like a matrix row, re-read it as a row to get dim
      reader.undo();
      const mr = reader.nextRow();
      const dim = mr.length;
      // Symbols must be 123..dim
      symbols = "";
      for (let i = 1; i <= dim; i++)
        symbols += `${i}`;
      reader.undo();
    } else
      // Otherwise it's a set of symbols
      symbols = l;

    // Construct arrays
    const board = new this(symbols, verbose);
    symbols = board.symbols;
    const dim = board.dim;

    // Read and construct areas
    const amat = reader.nextMatrix(dim);
    for (let row = 0; row < dim; row++) {
      const r = amat[row];
      for (let col = 0; col < dim; col++) {
        board.possibilities[row][col] = symbols;
        let areas = r[col].split("");
        for (let area of areas) {
          if (/\d/.test(area)) {
            area = Number(area);
            if (!board.areas[area])
              board.areas[area] = new Area(area);
            board.areas[area].addCell(row, col);
            board.rc2a[row][col].push(area);
          }
        }
      }
    }

    // Check
    for (let a = 0; a < board.areas.length; a++)
      if (board.areas[a].cells.length !== dim)
        throw new Error(
          `Area ${a} has the wrong number of cells ${board.areas[a].cells.length} != ${dim}`);

    // Read and fill initial values
    const imat = reader.nextMatrix(dim);
    for (let row = 0; row < dim; row++) {
      let r = imat[row];
      for (let col = 0; col < dim; col++) {
        if (/\S/.test(r[col])) {
          if (board.symbols.indexOf(r[col]) < 0)
            throw new Error(`Unexpected symbol at line ${reader.line-1} '${r[col]}`);
          board.possibilities[row][col] = r[col];
        }
      }
    }
    return board;
  }

  /**
   * For a just-loaded board, fix each cell that only has one possibility
   * @return {number} number of fixes completed
   */
  firstFix() {
    let fixes = 0;
    for (let row = 0; row < this.dim; row++) {
      const r = this.possibilities[row];
      for (let col = 0; col < this.dim; col++) {
        const syms = r[col];
        if (syms.length === 1) {
          // Make the cell fixable by clearing the possibilities
          this.possibilities[row][col] = this.symbols;
          // -1 to discount the fix of this cell
          fixes += this.fix(syms, row, col) - 1;
        }
      }
    }
    return fixes;
  }

  /**
   * Create a string image of the of the board
   * for debugging/testing
   * @return {string} the image, in a format suitable for reading
   * by loadPuzzle
   */
  saveBoard() {
    let rows = [];
    for (let row = 0; row < this.dim; row++) {
      let r = [];
      for (let col = 0; col < this.dim; col++) {
        r.push(this.possibilities[row][col].length === 1 ? this.possibilities[row][col] : " ");
      }
      rows.push(`|${r.join("|")}|`);
    }
    return rows.join("\n");
  }

  /**
   * Create a string image of the areas of the board
   * for debugging/testing
   * @return {string} the image, in a format suitable for reading
   * by loadPuzzle
   */
  saveAreas() {
    let rows = [];
    for (let row = 0; row < this.dim; row++) {
      let r = [];
      for (let col = 0; col < this.dim; col++) {
        r.push(this.rc2a[row][col].join(""));
      }
      rows.push(`|${r.join("|")}|`);
    }
    return rows.join("\n");
  }

  /**
   * Load a possibilities matrix. The matrix must be
   * the correct dimension, there are no checks.
   */
  loadPossibilities(s) {
    const reader = new MatrixReader(s);
    const mat = reader.nextMatrix(this.dim);
    for (let row = 0; row < this.dim; row++) {
      for (let col = 0; col < this.dim; col++) {
        this.possibilities[row][col] =
        mat[row][col].split("").filter(e => e !== " ").join("");
      }
    }
  }

  // Debug only
  checkPossibilities(s, fail) {
    const reader = new MatrixReader(s);
    const mat = reader.nextMatrix(this.dim);
    for (let row = 0; row < this.dim; row++) {
      for (let col = 0; col < this.dim; col++) {
        const syms = mat[row][col].split("").filter(e => e !== " ").join("");
        for (const sym of syms) {
          if (!this.couldBe(sym, row, col))
            fail(`Possibilities check at (${row},${col}) expected:${syms} actual:${this.possibilities[row][col]}`);
        }
        for (const sym of this.possibilities[row][col])
          if (syms.indexOf(sym) < 0)
            fail(`Possibilities check at (${row},${col}) expected:${syms} actual:${this.possibilities[row][col]}`);
      }
    }
  }

  /**
   * Create a string image of the possibilities of the board
   * for debugging/testing
   * @param {number?} row if a number, dump a single row, otherwise
   * dump the whole board.
   * @return {string} the image, in a format suitable for reading
   * by loadPuzzle
   */
  savePossibilities(row) {

    const possRow = row => {
      const r = [];
      for (let col = 0; col < this.dim; col++) {
        const p = this.possibilities[row][col];
        const posses = [];
        for (const i of this.symbols) {
          if (p.length === 0)
            posses.push("X");
          else if (p.indexOf(i) >= 0)
            posses.push(i);
          else
            posses.push(" ");
        }
        r.push(posses.join(""));
      }
      return `|${r.join("|")}|`;
    };

    if (typeof row === "number")
      return possRow(row);

    const rows = [];
    for (let row = 0; row < this.dim; row++)
      rows.push(possRow(row));
    return rows.join("\n");
  }

  /**
   * Create a string image of the board in the form read by loadPuzzle
   * @return {string} the image, in a format suitable for reading
   !* by loadPuzzle
   */
  savePuzzle() {
    return `# Symbols
${this.symbols}
# Areas
${this.saveAreas()}
# Board
${this.saveBoard()}`;
  }
}

export { Board };


