/**
 * Solver for tuples.
 * A tuple is found when there are N cells in an area, row, or column,
 * that all only have the same N candidates. We can then eliminate those
 * candidates from the rest of the containing area/row/column.
 */
class Tuples {

  /**
   * For each area, see if there are N cells in the area that all only
   * have the same N candidates, where N > 1. Eliminate those
   * candidates from the rest of the row/column/area.
   * @param {Board} board to study
   * @return {number} number of cells fixed
   */
  static area(board) {
    let fixes = 0;
    for (const area of board.areas) {
      // Build an array of maybes for each cell in the area
      const maybes = [];
      let index = 0;
      for (const cell of area.cells) {
        const maybe = board.possibilities[cell.row][cell.col];
        // Only interested if there are at least 2 maybes, and they are not all numbers
        if (maybe.length > 1 && maybe.length < board.dim) {
          //board.report(`Area ${area.id} Cell (${cell.row},${cell.col}) ${maybe}`);
          maybes.push({ row: cell.row, col: cell.col, index: index, syms: maybe });
        }
        index++;
      }

      if (maybes.length === 0)
        continue;

      // sort the maybes by symbols, row, col
      maybes.sort((a, b) => {
        if (a.syms === b.syms) {
          if (a.row === b.row) {
            if (a.col === b.col)
              return 0; // should never happen
            if (a.col < b.col)
              return -1;
            return 1;
          } else if (a.row < b.row)
            return -1;
          else
            return 1;
        } else if (a.syms < b.syms)
          return -1;
        else
          return 1;
      });

      // Find subsets of identical possibilities
      for (let i = 0; i < maybes.length - 1; i++) {
        const syms = maybes[i].syms;
        let j = i + 1;
        const keep = [ maybes[i].index ];
        while (j < maybes.length && maybes[j].syms === syms) {
          keep.push(maybes[j].index);
          j++;
        }
        if (j > i + 1 && maybes[i].syms.length === j - i) {
          // We have a subset.
          if (board.report)
            board.report(`Area ${area.id} tuple from ${i} to ${j}`, maybes);

          // Eliminate the possibilities from the other cells in the
          // area.
          for (const sym of syms)
            board.cantBeInArea(sym, area.id, keep);
        }
      }
    }
    return fixes;
  }

  /**
   * For each row, see if there are N cells in the row that all only
   * have the same N candidates, where N > 1. Eliminate those
   * candidates from the rest of the row.
   * @param {Board} board to study
   * @return {number} number of cells fixed
   */
  static row(board) {
    let fixes = 0;

    for (let row = 0; row < board.dim; row++) {
      // Build an array of maybes for each cell in the row
      const maybes = [];
      for (let col = 0; col < board.dim; col++) {
        const maybe = board.possibilities[row][col];
        // Only interested if there are at least 2 maybes, and they are not all numbers
        if (maybe.length > 1 && maybe.length < board.dim) {
          //if (board.report) board.report(`Row ${row} col ${col} ${maybe}`);
          maybes.push({ col: col, syms: maybe });
        }
      }

      if (maybes.length === 0)
        continue;

      // sort the maybes by symbols, col
      maybes.sort((a, b) => {
        if (a.syms === b.syms) {
          if (a.col === b.col)
            return 0;
          if (a.col < b.col)
            return -1;
          return 1;
        } else if (a.syms < b.syms)
          return -1;
        else
          return 1;
      });

      for (let i = 0; i < maybes.length - 1; i++) {
        //if (board.report) board.report(i);
        const syms = maybes[i].syms;
        let j = i + 1;
        const keep = [ maybes[i].col ];
        while (j < maybes.length && maybes[j].syms === syms) {
          //board.report("+",j);
          keep.push(maybes[j].col);
          j++;
        }
        //board.report(i, j, "not", not);
        if (j > i + 1 && syms.length === j - i) {
          // We have a subset.
          if (board.report)
            board.report(`Row ${row} tuple from ${i} to ${j}`, maybes);
          for (const sym of syms.split(""))
            fixes += board.cantBeInRow(sym, row, keep);
        }
      }
    }
    return fixes;
  }

  /**
   * For each column, see if there are N cells in the row that all only
   * have the same N candidates, where N > 1. Eliminate those
   * candidates from the rest of the column.
   * @param {Board} board to study
   * @return {number} number of cells fixed
   */
  static column(board) {
    let fixes = 0;

    for (let col = 0; col < board.dim; col++) {
      // Build an array of maybes for each cell in the row
      const maybes = [];
      for (let row = 0; row < board.dim; row++) {
        const maybe = board.possibilities[row][col];
        // Only interested if there are at least 2 maybes, and they are not all numbers
        if (maybe.length > 1 && maybe.length < board.dim) {
          //board.report(`Row ${row} col ${col} ${maybe}`);
          maybes.push({ row: row, syms: maybe });
        }
      }

      if (maybes.length === 0)
        continue;

      // sort the maybes by symbols, col
      maybes.sort((a, b) => {
        if (a.syms === b.syms) {
          if (a.col === b.col)
            return 0;
          if (a.col < b.col)
            return -1;
          return 1;
        } else if (a.syms < b.syms)
          return -1;
        else
          return 1;
      });

      for (let i = 0; i < maybes.length - 1; i++) {
        //board.report(i);
        const syms = maybes[i].syms;
        let j = i + 1;
        const keep = [ maybes[i].row ];
        while (j < maybes.length && maybes[j].syms === syms) {
          //board.report("+",j);
          keep.push(maybes[j].row);
          j++;
        }
        //board.report(i, j, "not", not);
        if (j > i + 1 && syms.length === j - i) {
          // We have a subset.
          board.report(`Col ${col} tuple from ${i} to ${j}`, maybes);

          for (const sym of syms.split(""))
            fixes += board.cantBeInColumn(sym, col, keep);
        }
      }
    }
    return fixes;
  }
};

export { Tuples }
