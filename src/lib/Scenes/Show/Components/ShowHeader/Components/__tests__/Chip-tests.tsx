import React from "react"
import * as renderer from "react-test-renderer"

import { Chip } from "../Chip"

describe("Chip", () => {
  it("renders properly", () => {
    const chip = renderer.create(<Chip text="chip" />)
    expect(chip).toMatchSnapshot()
  })
})
