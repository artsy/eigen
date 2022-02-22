import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"

import { SavedItemRow } from "./SavedItemRow"

const props = {
  href: "/artist/petra-collins",
  name: "Petra Collins",
  image: { url: "https://d32dm0rphc51dk.cloudfront.net/GeP7pPxLcVRva8UTzBBGXQ/large.jpg" },
}

it("renders without throwing an error", () => {
  renderWithWrappers(<SavedItemRow {...props} />)
})
