import { ArtsyWebView } from "lib/Components/ArtsyWebView"
import React from "react"
import { renderWithWrappers } from "../../../tests/renderWithWrappers"
import { SaleFAQ } from "../SaleFAQ"

describe("SaleFAQ", () => {
  it("returns a webview", () => {
    const tree = renderWithWrappers(<SaleFAQ />)

    expect(tree.root.findAllByType(ArtsyWebView).length).toEqual(1)
  })
})
