/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
License Apache 2.0. See README.md at the root of this distribution for
full copyright and license information.*/
import chai from "chai";
const assert = chai.assert;

import { Board, nbid, cid, rid } from "../src/Board.js";
import { yWing } from "../src/YWing.js";

describe("Y-wing", () => {

  function UNit() {}

  // Monkey-patch to avoid fixes running on in an insoluble puzzle and throwing
  let sawElims = [];
  let b;
  function eliminate(sym, row, col) {
      //console.log(`Eliminate "${sym}" from ${bid(row, col)}`);
      sawElims.push([sym, row, col]);
      b.possibilities[row][col] = b.possibilities[row][col].replace(sym, "");
      return 1;
    };

  it("insoluble", () => {
    b = Board.loadPuzzle(`
# From https://masteringsudoku.com/y-wings/
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

|1| | |2|4| | | | |
| |5| |6|1| |2|3|9|
| |2| | |5| | |1| |
| | | |7| | |3|2| |
| | |2|1|3|5|6| |7|
| |7| | | |2|1| | |
| |6|1| |2| | |7|3|
|5|9| | |7|1| |6|2|
|2| |7| |8|6| | |1|
`);
    b.loadPossibilities(`
|1        |  3    8 |         | 2       |   4     |         |         |         |         |
|         |    5    |   4   8 |     6   |1        |         | 2       |  3      |        9|
|         | 2       |         |         |    5    |         |         |1        |         |
|         |         |         |      7  |         |         |  3      | 2       |         |
|         |         | 2       |1        |  3      |    5    |     6   |         |      7  |
|         |      7  |         |         |         | 2       |1        |         |         |
|   4   8 |     6   |1        |         | 2       |         |         |      7  |  3      |
|    5    |        9|  34   8 |         |      7  |1        |         |     6   | 2       |
| 2       |  34     |      7  |         |       8 |     6   |         |         |1        |
`);

    sawElims = [];
    b.cantBeInCell = eliminate;
    //report = console.debug;
    const elims = yWing(b);
    assert.equal(elims, 10);
    assert.equal(sawElims.length, 10);
    assert.deepEqual(sawElims[0], [ "4", 7, 2 ]);
  });

  it("hum", () => {
    b = Board.loadPuzzle(`
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
    b.loadPossibilities(`
|    5    |       8 | 2       |1    6   |   4     |  3      |        9|1    6   |      7  |
|  34  7  |1 34  7  |        9|1    6 8 |      78 |    5    |1  4 6 8 |1  4 6 8 | 2       |
|     6   |1  4  7  |1  4     |        9| 2       |1     78 |  3      |1  45  8 |1  45  8 |
|1        |     6   |    5    |      78 |  3      |   4     |      78 | 2       |        9|
| 2 4   8 | 2 4     |  3      |1     78 |        9|     6   |    5    |1  4  78 |1  4   8 |
|   4   8 |        9|      7  | 2       |    5    |1      8 |1  4 6 8 |1  4 6 8 |  3      |
|  34  7  |1 34  7  |     6   |    5    |      78 | 2       |1  4  78 |        9|1  4   8 |
| 2    7  |12  5 7  |1      8 |   4     |     6   |        9|1     78 |  3      |1   5  8 |
|        9|   45 7  |   4   8 |  3      |1        |      78 | 2       |   45 78 |     6   |
`);
    sawElims = [];
    b.cantBeInCell = eliminate;
    //b.report = console.debug;
    const elims = yWing(b);
    assert.equal(elims, 4);
    assert.deepEqual(sawElims, [ [ '8', 5, 6 ], [ '8', 5, 7 ], [ '7', 2, 5 ], [ "8", 2, 5 ] ]);
  });
});
