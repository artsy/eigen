import React from "react"
import * as renderer from "react-test-renderer"

import SavedItemRow from "../SavedItemRow"

const props = {
  href: "/artist/petra-collins",
  name: "Petra Collins",
  image: { url: "https://d32dm0rphc51dk.cloudfront.net/GeP7pPxLcVRva8UTzBBGXQ/large.jpg" },
}

it("renders correctly", () => {
  const tree = renderer.create(<SavedItemRow {...props} />).toJSON()
  expect(tree).toMatchSnapshot()
})
