/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import chai from "chai";
const assert = chai.assert;

import { Board } from "../src/Board.js";
import { yWing } from "../src/YWing.js";

describe("Y-wing", () => {

  function UNit() {}

  it("apply", () => {
    const b = Board.loadPuzzle(`
123456789
|0|0|0|1|1|1|2|2|2|
|0|0|0|1|1|1|2|2|2|
|0|0|0|1|1|1|2|2|2|
|3|3|3|4|4|4|5|5|5|
|3|3|3|4|4|4|5|5|5|
|3|3|3|4|4|4|5|5|5|
|6|6|6|7|7|7|8|8|8|
|6|6|6|7|7|7|8|8|8|
|6|6|6|7|7|7|8|8|8|

|9| | |2| | |7|5| |
| |5| |6|9| |2|3|1|
|4|2| | | | | | | |
| |9| | | | | | | |
| | |2| | | | | | |
| |7| | | |6| | | |
| |6|9| | |1| | | |
|5|1| | | |3| | | |
|2| |7| |8| | | |9|
`);
    // Note this is insoluble, it just has a suitable Y-wing (which it will find 3 times)
    b.loadPossibilities(`
|       9 |  3    8 |1 3  6 8 | 2       |1 34     |   4   8 |      7  |    5    |   4 6 8 |
|     78  |    5    |       8 |     6   |        9|   4  78 | 2       |  3      |1        |
|   4     | 2       |1 3  6 8 |1 3 5 78 |1 3 5 7  |    5 78 |     6 89|     6 89|     6 8 |
|1 3  6 8 |        9|1 3456 8 |1 345 78 |12345 7  | 2 45 78 |1 3456 8 |12 4 678 | 2345678 |
|1 3  6 8 |  34   8 | 2       |1 345 789|1 3457   |   45 789|1 3456 89|1  4 6789|  345678 |
|1 3    8 |      7  |1 345  8 |1 345  89|12345    |     6   |1 345  89|12 4   89| 2345  8 |
|  3    8 |     6   |        9|   45 7  | 2 45 7  |1        |  345  8 | 2 4  78 | 2345 78 |
|    5    |1        |   4   8 |   4  7 9| 2 4 67  |  3      |   4 6 8 | 2 4 678 | 2 4 678 |
| 2       |  34     |      7  |   45    |       8 |   45    |1 3456   |1  4 6   |        9|
`);
    const sawFixes = [];
    // Monkey-patch to avoid fixes running on in an insoluble puzzle and throwing
    b.cantBeInCell = (sym, row, col) => {
      //console.log(`Fix "${sym}" to ${row}${col}`);
      sawFixes.push([sym, row, col]);
      b.possibilities[row][col] = sym;
      return 1;
    };
    //b.report = console.debug;
    const fixes = yWing(b);
    assert.equal(fixes, 1);
    assert.equal(sawFixes.length, 1);
    assert.deepEqual(sawFixes[0], [ "4", 8, 5 ]);
  });
});
