/*Copyright (C) 2024 Crawford Currie http://c-dot.co.uk
  License MIT. See README.md at the root of this distribution for full copyright
  and license information.*/
import { generateSquare } from "../src/Generator.js";

import chai from "chai";
const assert = chai.assert;

describe("Generator", () => {
  function UNit() {}

  it("generateSquare", () => {
    const b = generateSquare("ABCD");
    console.log(b.savePossibilities());
    console.debug(b.savePuzzle());
  });
});
