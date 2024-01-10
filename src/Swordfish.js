/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/

/**
 * Try and find a row-major swordfish.
 *
 * The Swordfish technique is fully described at
 * https://sudoku.com/sudoku-rules/swordfish/
 *
 * A Swordfish is found when for three rows, there are two or three
 * possible squares in which a particular symbol can be placed, and
 * for all three rows these squares lie in the same three columns. In
 * this case, this particular symbol can be eliminated as a
 * possibility for all other squares in those three columns.
 *
 * You can exchange rows and columns in this definition, so a column
 * swordfish is a row swordfish on the transposed board.
 *
 * This function returns after finding a single swordfish; if there
 * are more, repeated calls are needed, but it will generally be
 * sensible to loop through other strategies first.
 * @param {Board} board board to analyse
 * @return {number} number of fixes resulting from this method
 */
function swordfish(board) {
  let fixes = 0;
  for (const sym of board.symbols) {
    board.report(`Swordfishing for "${sym}"`);
    // Look along each of the rows in turn, recording each one that
    // contains only two or three squares with the current number as
    // a possibility.
    const couldBeRows = [];
    for (let row = 0; row < board.dim; row++) {
      const couldBeCols = [];
      for (let col = 0; col < board.dim; col++) {
        if (board.couldBe(sym, row, col))
          couldBeCols.push(col);
      }
      if (couldBeCols.length > 1 && couldBeCols.length < 4)
        couldBeRows.push({
          row: row,
          cols: couldBeCols
        });
    }
    board.report(`\t"${sym}" is in rows`, couldBeRows);

    // Look to see if there are three rows where the squares all
    // fall into the same three columns.

    // Intersect two column sets, each of which is known
    // to contain two or more columns. Note that the column
    // order in the sets is known.
    // Return the list of interescting columns
    function intersection(set1, set2) {
      if (set1.length < set2.length)
        // Are all the cols in set1 also in set2?
        return intersection(set2, set1);
      const is = [];
      // set1 is known to be longest
      // Are all the cols in set2 also in set1?
      for (const col of set2)
        if (set1.indexOf(col) >= 0)
          is.push(col);
      return is.sort();
    }

    // Compute the union of two column sets that are known to share
    // columns. Return the sorted union set.
    function union(set1, set2) {
      if (set1.length < set2.length)
        return union(set2, set1);
      const uni = Array.from(set1);
      // set1 is known to be longest
      for (const col of set2)
        if (uni.indexOf(col) < 0)
          uni.push(col);
      return uni.sort();
    }

    for (let i = 0; i < couldBeRows.length - 1; i++) {
      const matches = [ couldBeRows[i] ];

      // Find other rows using the same columns.

      // This has to be done carefully, because there's
      // potential for different column sets if the first
      // row tested only has two columns.
      let set1 = Array.from(couldBeRows[i].cols);
      for (let j = 0; j < couldBeRows.length; j++) {
        if (j === i)
          continue;
        const set2 = couldBeRows[j].cols;
        if (intersection(set1, set2).length > 0) {
          set1 = union(set1, set2);
          matches.push(couldBeRows[j]);
        }
      }

      if (matches.length === 3 && set1.length === 3) {
        board.report("\tSwordfish found!", matches, set1);
        // We can now eliminate sym from all the columns, keeping all the rows we matched
        const keep = [];
        for (const couldBe of matches)
          keep.push(couldBe.row);
        keep.sort();
        for (const col of set1) {
          board.report(`\tEliminate "${sym}" from column ${col} keeping rows`, keep);
          fixes += board.cantBeInColumn(sym, col, keep);
        }
        if (fixes > 0)
          return fixes;
        break;
      }
    }
  }
  return fixes;
}

export { swordfish }
