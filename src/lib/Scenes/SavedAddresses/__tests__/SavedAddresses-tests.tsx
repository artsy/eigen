import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { SavedAddresses } from "../SavedAddresses"

describe("Saved Addresses container", () => {
  const tree = renderWithWrappers(<SavedAddresses />)
  it("renders a saved addresses screen", () => {
    expect(extractText(tree.root)).toContain("No Saved Addresses")
  })
})
