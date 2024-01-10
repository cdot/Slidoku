/**

Blank board, all possibilities
do
  Select a random cell
   if it has multiple possibilities, and fixing it
   would not result in another cell having no possibilities
while all cells still have >0 possibilities
*/

import { Area } from "../src/Area.js";
import { Board } from "../src/Board.js";
import { solve } from "../src/Solver.js";

/**
 * Generate a puzzle frame. There is a unique solution to the frame
 * if all possibilities have only one symbol. If there is more than
 * one possibility for a cell, there can never be enough information
 * to solve the puzzle.
 * @return {Board} the generated puzzle
 */
function generateSquare(symbols) {
  const board = new Board(symbols);
  const dim = board.dim;
  const adim = Math.sqrt(dim);

  for (let i = 0; i < adim; i++) {
    for (let j = 0; j < adim; j++) {
      let area = new Area(`${i},${j}`);
      for (let r = 0; r < adim; r++) {
        for (let c = 0; c < adim; c++) {
          const row = i * adim + r;
          const col = j * adim + c;           
          area.addCell(row, col);
          board.rc2a[row][col].push(board.areas.length);
        }
      }
      board.areas.push(area);
    }
  }

  let empties = dim * dim, changes;
  let r, c, poss;
  do {
    changes = 0;
    do {
      r = Math.floor(Math.random() * dim);
      c = Math.floor(Math.random() * dim);
      poss = board.possibilities[r][c];
    } while (poss.length < 2);
    const s = poss.charAt(Math.floor(Math.random() * poss.length));
    changes += board.fix(s, r, c);
    changes += solve(board);
  } while (!board.isSolved());

  console.debug("Initial", board.toString());

  // Knock out random cells while still solveable
  let failures = 0;
  do {
    const copy = Board.clone(board);
    do {
      r = Math.floor(Math.random() * dim);
      c = Math.floor(Math.random() * dim);
      poss = board.possibilities[r][c];
      console.debug(`${r},${c} = ${poss}`);
    } while (poss.length > 1);
    console.debug(`Remove (${r},${c}) was ${poss}`);
    copy.possibilities[r][c] = board.symbols;
    console.debug(`Try\n${copy.savePossibilities()}`);
    solve(copy);
    if (!copy.isSolved())
      failures++;
    else
      board.possibilities[r][c] = board.symbols;
  } while (failures < 1000);

  return board;
}

export { generateSquare }
