/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import { Area } from "../src/Area.js";
import { Cell } from "../src/Cell.js";
import chai from "chai";
const assert = chai.assert;

describe("Area", () => {
  it("constructs", () => {
    const a = new Area(0);
    assert.equal(a.cells.length, 0);
    assert.equal(a.id, 0);
  });

  it("constructs/addCell", () => {
    const a = new Area(0);
    a.addCell(1, 3);
    assert.equal(a.cells.length, 1);
  });

  it("isSolved", () => {
    const b = {
      dim: 2,
      possibilities:
        [
          [ "01", "01" ],
          [ "01", "01" ]
        ]
    };

    const a = new Area(0);
    a.addCell(0, 1);
    a.addCell(1, 0);
    assert(!a.isSolved(b));
    b.possibilities[0][1] = "0";
    b.possibilities[1][0] = "1";
    assert(a.isSolved(b));
    b.possibilities[1][0] = "0";
    assert(!a.isSolved(b));
  });
});
