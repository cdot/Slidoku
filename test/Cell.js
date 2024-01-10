/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import { Cell } from "../src/Cell.js";
import chai from "chai";
const assert = chai.assert;

describe("Cell", () => {
  it("constructs", () => {
    const c = new Cell(99, 65);
    assert.equal(c.row, 99);
    assert.equal(c.col, 65);
  });
         
  it("adjacent", () => {
    const c = new Cell(1, 1);

    assert(c.adjacentTo(new Cell(0, 1)));
    assert(c.adjacentTo(new Cell(2, 1)));
    assert(c.adjacentTo(new Cell(1, 0)));
    assert(c.adjacentTo(new Cell(1, 2)));

    assert(!c.adjacentTo(new Cell(1, 1)));
    assert(!c.adjacentTo(new Cell(0, 0)));
    assert(!c.adjacentTo(new Cell(0, 2)));
    assert(!c.adjacentTo(new Cell(2, 0)));
    assert(!c.adjacentTo(new Cell(2, 2)));
  });
         
});
