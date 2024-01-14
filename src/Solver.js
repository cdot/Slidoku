/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution
  for full copyright and license information.*/

import { Board } from "../src/Board.js";
import { Singles } from "../src/Singles.js";
import { Tuples } from "../src/Tuples.js";
import { xWing } from "../src/XWing.js";
import { yWing } from "../src/YWing.js";
import { swordfish } from "../src/Swordfish.js";

/**
 * The general problem of solving Sudoku puzzles on n2×n2 grids of n×n
 * blocks is known to be NP-complete (it can be expressed as a graph
 * colouring problem).
 */
function solve(board) {
  let changes, allChanges = 0;
  const requires = {};

  function solvedWith(fixes, method) {
    if (fixes > 0) {
      board.report(`-- Fixed ${fixes} using ${method}`);
      if (typeof requires[method] !== "number")
        requires[method] = 0;
      requires[method] += fixes;
      changes += fixes;
      allChanges += fixes;
      return board.isSolved();
    }
    return false;
  }

  do {
    changes = 0;

    if (solvedWith(Singles.board(board), "Singles"))
      break;

    // Simple stuff is done, checkpoint before moving to
    // more advanced strategies
    //console.log(board.savePossibilities());

    if (solvedWith(Tuples.row(board), "Row tuples"))
      break;

    if (changes > 0)
      continue;

    if (solvedWith(Tuples.column(board), "Column tuples"))
      break;

    if (changes > 0)
      continue;

    if (solvedWith(Tuples.area(board), "Area tuples"))
      break;

    if (changes > 0)
      continue;

    if (solvedWith(xWing(board), "XWing"))
      break;

    if (changes > 0)
      continue;

    if (solvedWith(yWing(board), "YWing"))
      break;

    if (changes > 0)
      continue;

    if (solvedWith(swordfish(board), "Swordfish"))
      break;

  } while (changes > 0);

  return requires;
}

export { solve }
