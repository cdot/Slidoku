/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import chai from "chai";
const assert = chai.assert;

import { Board } from "../src/Board.js";
import { xWing } from "../src/XWing.js";

describe("X-wing", () => {

  function UNit() {}

  it("row solved", () => {
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

|8| | |6|9|7| | |2|
|2| |9|8|5|1| | | |
| |6|5|2|3|4|9|8| |
|6|5| | |4| | | |8|
| | |1| |2| |3| | |
|4| | | | | | |7|5|
| |2|6| |8| |4| | |
| | | |3| | |8|2| |
|3| | |4| |2| | |6|
`);
    // Note manually injected some possibilities from the diagram on
    // https://www.sudokusolver.com/play/techniques/advanced/
    // These can will be picked up by Singles.area, but a lot of others would be
    // too and we want to focus on the x-wing.
    b.loadPossibilities(`
|       8 |1 34     |  34     |     6   |        9|      7  |1   5    |1 345    | 2       |
| 2       |  34  7  |        9|       8 |    5    |1        |     67  |  34 6   |  34  7  |
|1     7  |     6   |    5    | 2       |  3      |   4     |        9|       8 |1     7  |
|     6   |    5    | 23   7  |1     7 9|   4     |  3     9|12       |1       9|       8 |
|      7 9|      789|1        |    5 7 9| 2       |    56 89|  3      |   4 6  9|   4    9|
|   4     |  3    89| 23    8 |1       9|1    6   |  3  6 89|12   6   |      7  |    5    |
|1   5 7 9| 2       |     6   |1   5   9|       8 |    5   9|   4     |1 3 5   9|1 3   7 9|
|1   5 7 9|1  4  7 9|   4  7  |  3      |1    67  |    56  9|       8 | 2       |1     7 9|
|  3      |1     789|      78 |   4     |1     7  | 2       |1   5 7  |1   5   9|     6   |
`);
    //b.report = console.debug;
    const fixes = xWing(b);
    // The resulting fixes should solve the puzzle
    b.checkPossibilities(`
|8|4|3|6|9|7|5|1|2|
|2|7|9|8|5|1|6|4|3|
|1|6|5|2|3|4|9|8|7|
|6|5|7|1|4|3|2|9|8|
|9|8|1|7|2|5|3|6|4|
|4|3|2|9|6|8|1|7|5|
|7|2|6|5|8|9|4|3|1|
|5|1|4|3|7|6|8|2|9|
|3|9|8|4|1|2|7|5|6|
`, mess => assert(false, mess));
    //console.log(b.savePossibilities());
    assert.equal(fixes, 43);
    assert(b.isSolved());
  });

  it("column", () => {
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

|8| | |6|9|7| | |2|
|2| |9|8|5|1| | | |
| |6|5|2|3|4|9|8| |
|6|5| | |4| | | |8|
| | |1| |2| |3| | |
|4| | | | | | |7|5|
| |2|6| |8| |4| | |
| | | |3| | |8|2| |
|3| | |4| |2| | |6|
`);
    // Note manually injected some possibilities from the diagram on
    // https://www.sudokusolver.com/play/techniques/advanced/
    // These can will be picked up by Singles.area, but a lot of others would be
    // too and we want to focus on the x-wing.
    b.loadPossibilities(`
|       8 |1 34     |  34     |     6   |        9|      7  |1   5    |1 345    | 2       |
| 2       |  34  7  |        9|       8 |    5    |1        |     67  |  34 6   |  34  7  |
|1     7  |     6   |    5    | 2       |  3      |   4     |        9|       8 |1     7  |
|     6   |    5    | 23   7  |1     7 9|   4     |  3     9|12       |1       9|       8 |
|      7 9|      789|1        |    5 7 9| 2       |    56 89|  3      |   4 6  9|   4    9|
|   4     |  3    89| 23    8 |1       9|1    6   |  3  6 89|12   6   |      7  |    5    |
|1   5 7 9| 2       |     6   |1   5   9|       8 |    5   9|   4     |1 3 5   9|1 3   7 9|
|1   5 7 9|1  4  7 9|   4  7  |  3      |1    67  |    56  9|       8 | 2       |1     7 9|
|  3      |1     789|      78 |   4     |1     7  | 2       |1   5 7  |1   5   9|     6   |
`);

    const t = b.transposed();
    //console.log(t.savePossibilities());

    const fixes = xWing(t);
    //console.log(b.savePossibilities());
    assert.equal(fixes, 0);
    assert(!t.isSolved());
  });

  it("row unsolved", () => {
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

| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |
| | | | | | | | | |
`);
    // Note manually injected some possibilities from the diagram on
    // https://www.sudokusolver.com/play/techniques/advanced/
    // These can will be picked up by Singles.area, but a lot of others would be
    // too and we want to focus on the x-wing.
    b.loadPossibilities(`
|2467|2479|3  |8|469|42 |5|1|46|
|2456|245 |8  |7|146|124|9|3|46|
|1   |49  |69 |3|469|5  |7|2|8 |
|567 |357 |567|2|137|13 |8|4|9 |
|8   |34  |1  |9|34 |6  |2|5|7 |
|247 |247 |79 |5|458|48 |1|6|3 |
|9   |6   |4  |1|2  |7  |3|8|5 |
|3   |8   |2  |6|5  |9  |4|7|1 |
|57  |1   |57 |4|38 |38 |6|9|2 |

`);
    //b.report = console.debug;
    const fixes = xWing(b);
    b.checkPossibilities(`
|2467|279 |3  |8| 69|42 |5|1|46|
|2456|25  |8  |7|1 6|124|9|3|46|
|1   |49  |69 |3|469|5  |7|2|8 |
|567 |357 |567|2|137|13 |8|4|9 |
|8   |34  |1  |9|34 |6  |2|5|7 |
|247 |27  |79 |5|58 |48 |1|6|3 |
|9   |6   |4  |1|2  |7  |3|8|5 |
|3   |8   |2  |6|5  |9  |4|7|1 |
|57  |1   |57 |4|38 |38 |6|9|2 |
`, mess => assert(false, mess));
    //console.log(b.savePossibilities());
  });
});
