/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import { Board } from "../src/Board.js";

import chai from "chai";
const assert = chai.assert;

const FIXABLE = `
|0|0|1|1|
|0|0|1|1|
|2|2|3|3|
|2|2|3|3|

| | | |4|
| |3| |2|
|1| | | |
| |2| | |
`;

describe("Board", () => {

  function UNit() {}

  it("constructs", () => {
    const b = new Board("12");
    assert.equal(b.dim, 2);
    assert.equal(b.symbols, "12");
    assert.equal(b.rc2a.length, 2);
    assert.equal(b.rc2a[0].length, 2);
    assert.equal(b.rc2a[1].length, 2);
    assert.equal(b.possibilities.length, 2);
    assert.equal(b.possibilities[0].length, 2);
    assert.equal(b.possibilities[1].length, 2);
    assert.equal(b.areas.length, 0);
  });

  it("initial fix", () => {
    const b = Board.loadPuzzle(`
*¶
|0|0|
|1|1|
|¶| |
| |¶|`);
    assert.equal(b.dim, 2);
    assert.equal(b.symbols, "*¶");
    assert.equal(b.areas.length, 2);
    assert.equal(b.rc2a.length, 2);
    assert.equal(b.rc2a[0].length, 2);
    assert.equal(b.savePossibilities(), `| ¶|*¶|
|*¶| ¶|`);
    assert.equal(b.rc2a[0][0], 0);
    assert.equal(b.rc2a[0][1], 0);
    assert.equal(b.rc2a[1][0], 1);
    assert.equal(b.rc2a[1][1], 1);
    assert.equal(b.firstFix(), 2);
    assert.equal(b.savePossibilities(), `| ¶|* |
|* | ¶|`);   
    assert(b.isSolved());
    assert.equal(b.saveBoard(),`|¶|*|
|*|¶|`);
  });

  it("read small", () => {
    const b = Board.loadPuzzle(FIXABLE);
    assert.equal(b.dim, 4);
    assert.equal(b.areas.length, 4);
    assert.equal(b.symbols, "1234");
    assert.equal(b.firstFix(), 11);
    // It's solveable by fixes alone
    assert.equal(b.savePossibilities(),`| 2  |1   |  3 |   4|
|   4|  3 |1   | 2  |
|1   |   4| 2  |  3 |
|  3 | 2  |   4|1   |`);
  });

  it("read classic", () => {
    const b = Board.loadClassic("100400006046091080005020000000500109090000050402009000000010900080930560500008004");
    assert.equal(b.symbols, "123456789");
    b.checkPossibilities(`|1        |123456789|123456789|   4     |123456789|123456789|123456789|123456789|     6   |
|123456789|   4     |     6   |123456789|        9|1        |123456789|       8 |123456789|
|123456789|123456789|    5    |123456789| 2       |123456789|123456789|123456789|123456789|
|123456789|123456789|123456789|    5    |123456789|123456789|1        |123456789|        9|
|123456789|        9|123456789|123456789|123456789|123456789|123456789|    5    |123456789|
|   4     |123456789| 2       |123456789|123456789|        9|123456789|123456789|123456789|
|123456789|123456789|123456789|123456789|1        |123456789|        9|123456789|123456789|
|123456789|       8 |123456789|        9|  3      |123456789|    5    |     6   |123456789|
|    5    |123456789|123456789|123456789|123456789|       8 |123456789|123456789|   4     |`);
    console.log(b.saveAreas());
  });

  it("clone", () => {
    const a = Board.loadPuzzle(FIXABLE);
    const b = Board.clone(a);
    assert.equal(b.dim, a.dim);
    assert.equal(b.symbols, a.symbols);
    assert(b.possibilities !== a.possibilities);
    assert.deepEqual(b.possibilities,a.possibilities);
    assert(b.rc2a !== a.rc2a);
    assert.deepEqual(b.rc2a,a.rc2a);
    assert(b.areas !== a.areas);
    assert.deepEqual(b.areas,a.areas);
    assert.equal(b.savePuzzle(),a.savePuzzle());
  });

  it("transposed", () => {
    const b = Board.loadPuzzle(`
ABCD
|0|0|1|1|
|0|0|1|1|
|2|2|3|3|
|2|2|3|3|

|A|B|C|D|
|C|A|D|B|
|D|C|B|A|
|B|D|A|C|
`);
    const n = b.transposed();
    assert.equal(n.saveBoard(),`|A|C|D|B|
|B|A|C|D|
|C|D|B|A|
|D|B|A|C|`);
    assert.equal(n.saveAreas(),`|0|0|2|2|
|0|0|2|2|
|1|1|3|3|
|1|1|3|3|`);
  });

  it("read overlapping areas", () => {
    const b = Board.loadPuzzle(`
|0| 0| 1|1|
|0|04|41|1|
|2|42|34|3|
|2| 2| 3|3|

| | | |4|
| |3| |2|
|1| | | |
| |2| | |
`);
    assert.equal(b.dim, 4);
    assert.equal(b.areas.length, 5);
    assert.equal(b.symbols, "1234");
    assert.deepEqual(b.rc2a[1][1], [ 0, 4 ]);
    assert.equal(b.saveAreas(), `|0|0|1|1|
|0|04|41|1|
|2|42|34|3|
|2|2|3|3|`);
  });

  it("read tiny already solved", () => {
    const b = Board.loadPuzzle(`
*¶
|0|0|
|1|1|
|¶|*|
|*|¶|`);
    assert(b.isSolved());
  });

  it("read jigsaw", () => {
    const b = Board.loadPuzzle(`# Symbols (optional)
123456789
# Areas
|0|0|0|0|1|1|1|2|2|
|0|3|0|1|1|2|2|2|2|
|3|3|0|1|1|4|2|5|2|
|3|0|0|1|1|4|2|5|5|
|3|3|4|4|4|4|4|5|5|
|3|3|6|4|7|7|8|8|5|
|6|3|6|4|7|7|8|5|5|
|6|6|6|6|7|7|8|5|8|
|6|6|7|7|7|8|8|8|8|

# Initial board
| | | |4| |2|6|7| |
| |9| |7|5| |1| | |
|6| | | | |4| | | |
|5| | | | | | |3| |
| | | | | | | | | |
| |8| | | | | | |1|
| | | |3| | | | |7|
| | |2| |1|3| |6| |
| |5|4|2| |6| | | |`);
    assert(!b.isSolved());

    // There is one fix, at 1,5 = 8
    assert.equal(b.firstFix(), 1);

    assert.equal(b.saveBoard(), `| | | |4| |2|6|7| |
| |9| |7|5|8|1| | |
|6| | | | |4| | | |
|5| | | | | | |3| |
| | | | | | | | | |
| |8| | | | | | |1|
| | | |3| | | | |7|
| | |2| |1|3| |6| |
| |5|4|2| |6| | | |`);
  });

  it("solveable by fixes", () => {
    const b = Board.loadPuzzle(`
|0|0|1|1|
|0|0|1|1|
|2|2|3|3|
|2|2|3|3|

| |3| |4|
| | |3| |
|1| |4| |
| | |2|1|`);
    assert.equal(b.firstFix(), 9);
    assert.equal(b.savePossibilities(),
                 `| 2  |  3 |1   |   4|
|   4|1   |  3 | 2  |
|1   | 2  |   4|  3 |
|  3 |   4| 2  |1   |`);
    assert.equal(b.saveBoard(),`|2|3|1|4|
|4|1|3|2|
|1|2|4|3|
|3|4|2|1|`);
  });

  it("insoluble by fixes", () => {
    const b = Board.loadPuzzle(`
|0|0|1|1|
|0|0|1|1|
|2|2|3|3|
|2|2|3|3|

| |1| |4|
| | | | |
|1| | | |
| | |2| |`);

    assert.equal(b.firstFix(), 8);

    // There are two possible solutions
    assert.equal(b.savePossibilities(),
                 `| 2  |1   |  3 |   4|
|  34|  34|1   | 2  |
|1   | 2  |   4|  3 |
|  34|  34| 2  |1   |`);
  });

  it("can't be in cell", () => {
    const b = Board.loadPuzzle(`
|0|0|
|1|1|

| | |
| | |`);
    assert(b.couldBe("1", 0, 0));
    assert.equal(b.cantBeInCell("1", 0, 0), 4);
    assert(!b.couldBe("1", 0, 0));
  });

  it("can't be in row", () => {
    const b = Board.loadPuzzle(`
|0|0|1|1|
|0|0|1|1|
|2|2|3|3|
|2|2|3|3|

| | | | |
| | | | |
| | | | |
| | | | |
`);
    assert(b.couldBe("1", 0, 0));
    assert.equal(b.cantBeInRow("1", 1, [ 1, 2 ]), 0);
    assert.equal(b.savePossibilities(0),`|1234|1234|1234|1234|`);
    assert.equal(b.savePossibilities(1),`| 234|1234|1234| 234|`);
    assert.equal(b.savePossibilities(2),`|1234|1234|1234|1234|`);
    assert.equal(b.savePossibilities(3),`|1234|1234|1234|1234|`);
  });

  it("can't be in column", () => {
    const b = Board.loadPuzzle(`
|0|0|1|1|
|0|0|1|1|
|2|2|3|3|
|2|2|3|3|

| | | | |
| | | | |
| | | | |
| | | | |
`);
    assert.equal(b.cantBeInColumn("1", 1, [ 1 ] ), 0);
    assert.equal(b.savePossibilities(0),`|1234| 234|1234|1234|`);
    assert.equal(b.savePossibilities(1),`|1234|1234|1234|1234|`);
    assert.equal(b.savePossibilities(2),`|1234| 234|1234|1234|`);
    assert.equal(b.savePossibilities(3),`|1234| 234|1234|1234|`);
  });
  
  it("can't be in area", () => {
    const b = Board.loadPuzzle(`
|0|0|1|1|
|0|0|1|1|
|2|2|3|3|
|2|2|3|3|

| | | | |
| | | | |
| | | | |
| | | | |
`);
    assert.equal(b.cantBeInArea("1", 0, [ 1 ] ), 0);
    assert.equal(b.savePossibilities(0),`| 234|1234|1234|1234|`);
    assert.equal(b.savePossibilities(1),`| 234| 234|1234|1234|`);
    assert.equal(b.savePossibilities(2),`|1234|1234|1234|1234|`);
    assert.equal(b.savePossibilities(3),`|1234|1234|1234|1234|`);
  });
});
