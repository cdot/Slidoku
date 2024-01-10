/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License Apache 2.0. See README.md at the root of this distribution for full copyright
  and license information.*/
import { Cell } from "../src/Cell.js";
import { Tile } from "../src/Tile.js";
import { JQuery } from "./JQuery.js";
import chai from "chai";
const assert = chai.assert;

describe("Tile", () => {
  before(() => JQuery.setup());

  it("constructs", () => {
    const t = new Tile("@");
    assert.equal(t.symbol, "@");
    assert(!t.fixed);
    assert(t.$tile);
    assert(t.$tile.hasClass("tile"));
    assert.equal(t.$tile.height(), Cell.PX);
    assert.equal(t.$tile.width(), Cell.PX);
    assert.equal(t.$tile.text(), "@");
    assert(!t.cell);
  });

  it("place", () => {
    const t = new Tile("@");
    assert(!t.cell);
    t.cell = new Cell(42, 84);
    assert(t.cell);
    assert.equal(t.cell.row, 42);
    assert.equal(t.cell.col, 84);
  });

  it("update", () => {
    const t = new Tile("@");
    t.fixed = true;
    t.empty = true;
    t.cell = new Cell(5, 6);
    assert(!t.$tile.hasClass("empty"));
    assert(!t.$tile.hasClass("fixed"));
    assert(!t.$tile.is("visible"));
    t.update();
    return new Promise(resolve => setTimeout(() => {
      assert(t.$tile.hasClass("empty"));
      assert(t.$tile.hasClass("fixed"));
      assert.equal(t.$tile.css("top"), (5 * Cell.PX) + "px");
      assert.equal(t.$tile.css("left"), (6 * Cell.PX) + "px");
      resolve();
    }, 5));
  });
});
