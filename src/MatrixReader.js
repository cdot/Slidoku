/**
 * A reader for simple matrices and single lines from a string.
 * Reads square matrices formatted using | to separate cells.
 * to separate cells. Blank lines and lines starting with "#" are ignored.
 */
class MatrixReader {

  /**
   * @param {string} s the string to read from
   * @param {string} separator the separator character between cells
   */
  constructor(s) {
    this.lines = s.split(/\r?\n/);
    this.line = 0;
  }

  /**
   * Get the next input line
   * @return {string} the next line in the input
   */
  nextLine() {
    // Skip comments and blank lines
    while (this.lines[this.line].indexOf("#") === 0
           || !/\S/.test(this.lines[this.line]))
      this.line++;
    return this.lines[this.line++];
  }

  /**
   * Get the next matrix row.
   * @param {number?} dim if specified, the expected number of columns
   * @return {string[]} array of cells (strings)
   * @throws {Error} if the formatting of the row is suspect
   */
  nextRow(dim) {
    const l = this.nextLine();
    if (l.indexOf("|") !== 0)
      throw new Error(`Expected a matrix row at ${this.line}: ${l}`);
    const row = l.substr(1, l.length - 2).split(/\|/);
    if (typeof dim !== "undefined") {
      if (row.length < dim)
        throw new Error(`Short row at line ${this.line}: [${l}]<${dim}`);
      if (row.length !== dim)
        throw new Error(`Columns mismatch ${row.length}<>${dim} at line ${this.line}: ${l}`);
    }
    return row;
  }

  /**
   * Get the next matrix.
   * @param {number} dim specifies the expected
   * dimension of the matrix.
   * @throws {Error} if the formatting of the matrix is suspect
   * @return {string[][]} 2D array of cells (strings)
   */
  nextMatrix(dim) {
    const mat = [];
    for (let row = 0; row < dim; row++)
      mat.push(this.nextRow(dim));
    if (mat.length !== dim) 
      throw new Error(`Rows mismatch ${mat.length}<>${dim} at line ${this.line}: ${this.lines[this.line - 1]}`);
    return mat;
  }

  undo() {
    this.line--;
  }
}

export { MatrixReader };

