/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution
  for full copyright and license information.*/

/**

Blank board, all possibilities
do
  Select a random cell
   if it has multiple possibilities, and fixing it
   would not result in another cell having no possibilities
while all cells still have >0 possibilities
*/

import { Area } from "../src/Area.js";
import { Board, bid } from "../src/Board.js";
import { solve } from "../src/Solver.js";

/**
 * Generate a puzzle frame. There is a unique solution to the frame
 * if all possibilities have only one symbol. If there is more than
 * one possibility for a cell, there can never be enough information
 * to solve the puzzle.
 * @return {Board} the generated puzzle
 */
function generateSquare(symbols) {
  // A new board will be initialised with all symbols
  // for each possibility
  const board = new Board(symbols);
  const dim = board.dim;
  const adim = Math.sqrt(dim);

  // Make areas
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

  // Populate the array with random cells while ensuring a legal
  // solution
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      // Pick a random cell from the possibilites for this cell
      // until all cells are fixed
      const poss = board.possibilities[r][c];
      if (poss.length > 1) {
        console.debug(`Picking ${bid(r,c)} from "${poss}"`);
        const sym = poss.charAt(Math.floor(Math.random() * poss.length));
        board.fix(sym, r, c);
      }
    }
  }

  console.debug("Initial");
  console.debug(board.savePossibilities());

  // Knock out random cells while still solveable
  let failures = 0;
  const copy = Board.clone(board);
  copy.report = console.debug;
  do {
    const r = Math.floor(Math.random() * dim);
    const c = Math.floor(Math.random() * dim);
    const poss = board.possibilities[r][c];
    if (poss.length > 0) {
      console.debug(`Try resetting ${bid(r, c)}, was ${poss}`);
      copy.possibilities[r][c] = board.symbols;
      try {
        console.debug(`Try\n${copy.savePossibilities()}`);
        solve(copy);
        if (!copy.isSolved())
          throw Error("Insoluble");
        else
          board.possibilities[r][c] = board.symbols;
      } catch (e) {
        console.log(`Catch ${e}`);
        copy.possibilities[r][c] = poss;
      }
    }
    return;
  } while (failures < 1000);
  return board;
}

export { generateSquare }
