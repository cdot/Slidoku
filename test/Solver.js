/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import chai from "chai";
const assert = chai.assert;

import { Board } from "../src/Board.js";
import { solve } from "../src/Solver.js";

const EASY = `
|0|0|0|1|1|1|2|2|2|
|0|0|0|1|1|1|2|2|2|
|0|0|0|1|1|1|2|2|2|
|3|3|3|4|4|4|5|5|5|
|3|3|3|4|4|4|5|5|5|
|3|3|3|4|4|4|5|5|5|
|6|6|6|7|7|7|8|8|8|
|6|6|6|7|7|7|8|8|8|
|6|6|6|7|7|7|8|8|8|

| |3|4| | |7| | |8|
| |8| | |6|5| | | |
| | | |3| | | |7| |
|2| | | | | |7| | |
|7|1| | |4| | |9|6|
| | |5| | | | | |1|
| |5| | | |2| | | |
| | | |1|7| | |6| |
|6| | |9| | |4|3| |
`;

const HARD1 = `
|0|0|0|1|1|1|2|2|2|
|0|0|0|1|1|1|2|2|2|
|0|0|0|1|1|1|2|2|2|
|3|3|3|4|4|4|5|5|5|
|3|3|3|4|4|4|5|5|5|
|3|3|3|4|4|4|5|5|5|
|6|6|6|7|7|7|8|8|8|
|6|6|6|7|7|7|8|8|8|
|6|6|6|7|7|7|8|8|8|

|1| |4| | | |2| | |
| | | |8| | |4| | |
|7| | | | | | | | |
|3| | | | | | |1| |
| | | |4| | | |7| |
| | | |2| |5| | | |
| |8| | | | | |3| |
| |5| | | | |6| | |
| | | | |1| | | | |
`;

const HARD2 = `# Unused
|0|0|0|1|1|1|2|2|2|
|0|0|0|1|1|1|2|2|2|
|0|0|0|1|1|1|2|2|2|
|3|3|3|4|4|4|5|5|5|
|3|3|3|4|4|4|5|5|5|
|3|3|3|4|4|4|5|5|5|
|6|6|6|7|7|7|8|8|8|
|6|6|6|7|7|7|8|8|8|
|6|6|6|7|7|7|8|8|8|

|3|4| | |7| | |8|
| |8| | |6|5| | | |
| | | |3| | | |7| |
|2| | | | | |7| | |
|7|1| | |4| | |9|6|
| | |5| | | | | |1|
| |5| | | |2| | | |
| | | |1|7| | |6| |
|6| | |9| | |4|3| |
`;

const JIGSAW = `123456789
|0|0|0|0|1|1|1|2|2|
|0|3|0|1|1|2|2|2|2|
|3|3|0|1|1|4|2|5|2|
|3|0|0|1|1|4|2|5|5|
|3|3|4|4|4|4|4|5|5|
|3|3|6|4|7|7|8|8|5|
|6|3|6|4|7|7|8|5|5|
|6|6|6|6|7|7|8|5|8|
|6|6|7|7|7|8|8|8|8|

| | | |4| |2|6|7| |
| |9| |7|5| |1| | |
|6| | | | |4| | | |
|5| | | | | | |3| |
| | | | | | | | | |
| |8| | | | | | |1|
| | | |3| | | | |7|
| | |2| |1|3| |6| |
| |5|4|2| |6| | | |
`;

describe("Solver", () => {
  function UNit() {}

  it("row and column singles only", () => {
    const b = Board.loadPuzzle(EASY);
    assert.equal(b.firstFix(), 13);
    const res = solve(b);
    assert.deepEqual(res,{Singles: 16+25});
    assert(b.isSolved(), b.savePossibilities());
  });

  it("area singles needed", () => {
    const b = Board.loadPuzzle(HARD1);
    assert.equal(b.firstFix(), 0);
    const res = solve(b);
    assert.deepEqual(res, {Singles: 22+14+28});
    assert(b.isSolved(), b.savePossibilities());
  });

  it("solveable by elimination", () => {
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

| | |7| | | | |8|2|
|2| | |9| |8| |6| |
| | | |1| | | | | |
| | | | |4| | | | |
| |3| | | | |5| | |
|7| | |2| |6| |9| |
| | | | |7| | |4| |
|8| | | |1| | | | |
| | |5|8| |4|9| | |`);
    assert.equal(b.firstFix(), 1);
    //b.report = console.debug;
    const res = solve(b);
    assert.deepEqual(res, {Singles: 31 + 9 + 17});
    assert(b.isSolved(), b.savePossibilities());
  });

  it("jigsaw", () => {
    const b = Board.loadPuzzle(JIGSAW);
    assert.equal(b.firstFix(), 1);
    const res = solve(b);
    assert.deepEqual(res, {Singles: 11+16+29});
    assert(b.isSolved(), b.savePossibilities());
  });

  it("5 y-wings", () => {
    // Fiendish puzzle from
    // https://www.sudokuwiki.org/sudoku.htm?bd=900040000000600031020000090000700020002935600070002000060000073510009000000080009
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

|9| | | |4| | | | |
| | | |6| | | |3|1|
| |2| | | | | |9| |
| | | |7| | | |2| |
| | |2|9|3|5|6| | |
| |7| | | |2| | | |
| |6| | | | | |7|3|
|5|1| | | |9| | | |
| | | | |8| | | |9|
`);
    assert.equal(b.firstFix(), 0);
    //b.report = console.debug;
    const res = solve(b);
    assert.deepEqual(res, {Singles:6+4+7,YWing:40});
    assert(b.isSolved(), b.savePossibilities());
    //nsole.log(result);
    //nsole.log(b.savePossibilities());
  });

  it("insoluble 2", () => {
    // Fiendish puzzle from
    // https://www.sudokuwiki.org/Weekly_Sudoku.aspx
    // known to be insoluble by us
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

| | |2| |6| |3| | |
| |5| |8| | | |4| |
|1| | | | |7| |6|9|
| |7| | | | | |5| |
| | |9| | | | | |2|
|3| | | | | |6| | |
| |6| | |5| |1| | |
| | |4|2| | | | | |
|8| | | | |3| | | |
`);
    assert.equal(b.firstFix(), 0);
    //b.report = console.debug;
    const result = solve(b);
    assert.deepEqual(result, {});
    assert(!b.isSolved(), b.savePossibilities());
  });

  it("17 clues", () => {
    // Fiendish puzzle from
    // https://www.sudokuwiki.org/Weekly_Sudoku.aspx
    // known to be insoluble by us
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
# It only has 17 clues, but it is trivially solveable using singles alone
| | | | | | | |1| |
| | | | | |2| | |3|
| | | |4| | | | | |
| | | | | | |5| | |
|4| |1|6| | | | | |
| | |7|1| | | | | |
| |5| | | | |2| | |
| | | | |8| | |4| |
| |3| |9|1| | | | |
`);
    assert.equal(b.firstFix(), 0);
    //b.report = console.debug;
    const result = solve(b);
    assert.deepEqual(result, {Singles:64});
    assert(b.isSolved(), b.savePossibilities());
  });

  it("4x4", () => {
    // A 4x4 board that is soluble is always soluble in firstFix
    const b = Board.loadPuzzle(`
ABCD
|0|0|1|1|
|0|0|1|1|
|2|2|3|3|
|2|2|3|3|

|A| | | |
| | |D| |
| |B| |D|
| |A| |B|`);
    assert.equal(b.firstFix(), 10);
    assert(b.isSolved(), b.savePossibilities());    
  });

  it("single chain", () => {
    // Fiendish puzzle from
    // https://www.sudokuwiki.org/sudoku.htm?bd=100400006046091080005020000000500109090000050402009000000010900080930560500008004
    const b = Board.loadClassic("100400006046091080005020000000500109090000050402009000000010900080930560500008004");
    assert.equal(b.firstFix(), 0);
    b.report = console.debug;
    const result = solve(b);
    assert.deepEqual(result, {Singles:28});
    // insoluble without inference chain
    assert(b.isSolved(), b.savePossibilities());
  });

});
