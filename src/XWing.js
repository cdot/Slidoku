/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License MIT. See README.md at the root of this distribution for full copyright
  and license information.*/

/**
 * Find row x-wings and perform eliminations.
 *
 * The X-wing technique is fully described at
 * https://sudoku.com/sudoku-rules/h-wing/
 *
 * An x-wing is found when for two rows, there are two, and only two,
 * possible squares in which a particular symbol can be placed, and
 * for both rows these squares lie in the same two columns. In this
 * case, this symbol can be eliminated as a possibility for all other
 * squares in those two columns. You can exchange rows and columns in
 * this definition, a column x-wing is a row x-wing on the transposed
 * board.
 *
 * This function will test for row x-wings only, and will return after
 * finding a single x-wing. It will generally be sensible to loop through
 * other strategies before trying X wing again.
 *
 * @param {Board} board board to study
 * @return {number} number of resulting fixes
 */
function xWing(board) {
  let fixes = 0;
  for (const sym of board.symbols) {
    const couldBeRows = [];
    for (let row = 0; row < board.dim; row++) {
      const couldBeCols = [];
      for (let col = 0; col < board.dim; col++) {
        if (board.couldBe(sym, row, col))
          couldBeCols.push(col);
      }
      if (couldBeCols.length === 2)
        couldBeRows.push({
          row: row,
          cols: couldBeCols,
          hash: couldBeCols.join("/")
        });
    }

    // Are there two rows which have the same columns?
    // Sort the rows by column hash
    couldBeRows.sort((a, b) => {
      if (a.hash === b.hash)
        return 0;
      if (a.hash < b.hash)
        return -1;
      return 1;
    });
    
    for (let i = 0; i < couldBeRows.length - 1; i++) {
      let j = i + 1;
      const keep = [ couldBeRows[i].row ];
      while (j < couldBeRows.length
             && couldBeRows[j].hash === couldBeRows[i].hash) {
        keep.push(couldBeRows[j].row);
        j++;
      }
      if (j - i === 2) {
        // Eliminate sym from the rest of the two columns
        for (const col of couldBeRows[i].cols) {
          board.report(`\tRow X-wing; eliminate ${sym} from column ${col} keeping`, keep);
          fixes += board.cantBeInColumn(sym, col, keep);
        }
      }
    }
    if (fixes > 0)
      return fixes;
  }
  return fixes;
}

export { xWing }
