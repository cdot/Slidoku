import { Board } from "../src/Board.js";
import { Singles } from "../src/Singles.js";
import { Tuples } from "../src/Tuples.js";
import { xWing } from "../src/XWing.js";
import { yWing } from "../src/YWing.js";
import { swordfish } from "../src/Swordfish.js";

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

    board.report("-- Row singles");
    if (solvedWith(Singles.row(board), "Row singles"))
      break;

    if (solvedWith(Singles.column(board), "Column singles"))
      break;
    console.log(board.savePossibilities());
    if (solvedWith(Singles.area(board), "Area singles"))
      break;

    if (solvedWith(Tuples.row(board), "Row tuples"))
      break;

    if (solvedWith(Tuples.column(board), "Column tuples"))
      break;

    if (solvedWith(Tuples.area(board), "Area tuples"))
      break;

    if (solvedWith(xWing(board), "XWing"))
      break;

    if (solvedWith(yWing(board), "YWing"))
      break;

    if (solvedWith(swordfish(board), "Swordfish"))
      break;

  } while (changes > 0);

  return requires;
}

export { solve }
