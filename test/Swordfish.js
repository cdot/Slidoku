/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import chai from "chai";
const assert = chai.assert;

import { Board } from "../src/Board.js";
import { swordfish } from "../src/Swordfish.js";
import { Singles } from "../src/Singles.js";

const BASE = `
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

|9| |8|7|3|5|1| | |
| |1| |9|8| | |3| |
| | | | |2| | |9|8|
|8| |5|4|6|9|3|1| |
| |9| | |7| | | | |
| |4|3|2|5| |9| | |
|2|5| | |9| | | |1|
| |8|9|5|1|2| |6|3|
| | |1|8|4|7| | |9|
`;

describe("Swordfish", () => {

  function UNit() {}
  
  it("expect 1", () => {
    const b = Board.loadPuzzle(BASE);
    // From https://sudoku-guru.com/rules/swordfish/
    b.loadPossibilities(`
|9|26|8|7|3|5|1|24|246|
|4567|1|2467|9|8|46|2567|3|2567|
|34567|367|467|16|2|148|567|9|8|
|8|27|5|4|6|9|3|1|27|
|16|9|26|23|7|138|24568|2458|2456|
|167|4|3|2|5|18|9|78|76|
|2|5|47|36|9|36|478|478|1|
|47|8|9|5|1|2|47|6|3|
|36|36|1|8|4|7|25|25|9|
`);
    //b.report = console.debug;
    assert.equal(swordfish(b), 1);
    // "1" will be fixed to (4,0) as a side-effect of the swordfish
    b.checkPossibilities(
      `
|9|26|8|7|3|5|1|24|246|
|457|1|2467|9|8|46|2567|3|257|
|3457|37|467|16|2|148|567|9|8|
|8|27|5|4|6|9|3|1|27|
|1|9|26|23|7|38|24568|2458|245|
|67|4|3|2|5|18|9|78|76|
|2|5|47|36|9|36|478|478|1|
|47|8|9|5|1|2|47|6|3|
|36|36|1|8|4|7|25|25|9|`,
      mess => assert(false, mess + "\n" + b.savePossibilities()));
  });

  it("transposed", () => {
    let b = Board.loadPuzzle(BASE);
    b.loadPossibilities(`
|9|26|8|7|3|5|1|24|246|
|4567|1|2467|9|8|46|2567|3|2567|
|34567|367|467|16|2|148|567|9|8|
|8|27|5|4|6|9|3|1|27|
|16|9|26|23|7|138|24568|2458|2456|
|167|4|3|2|5|18|9|78|76|
|2|5|47|36|9|36|478|478|1|
|47|8|9|5|1|2|47|6|3|
|36|36|1|8|4|7|25|25|9|
`);
    b = b.transposed();
    //b.report = console.debug;
    assert.equal(swordfish(b), 0);
    // There's no swordfish on this axis
    b.checkPossibilities(`
|        9|   4567  |  34567  |       8 |1    6   |1    67  | 2       |   4  7  |  3  6   |
| 2   6   |1        |  3  67  | 2    7  |        9|   4     |    5    |       8 |  3  6   |
|       8 | 2 4 67  |   4 67  |    5    | 2   6   |  3      |   4  7  |        9|1        |
|      7  |        9|1    6   |   4     | 23      | 2       |  3  6   |    5    |       8 |
|  3      |       8 | 2       |     6   |      7  |    5    |        9|1        |   4     |
|    5    |   4 6   |1  4   8 |        9|1 3    8 |1      8 |  3  6   | 2       |      7  |
|1        | 2  567  |    567  |  3      | 2 456 8 |        9|   4  78 |   4  7  | 2  5    |
| 2 4     |  3      |        9|1        | 2 45  8 |      78 |   4  78 |     6   | 2  5    |
| 2 4 6   | 2  567  |       8 | 2    7  | 2 456   |     67  |1        |  3      |        9|
`, mess => assert(false, mess + "\n" + b.savePossibilities()));
  });
});
