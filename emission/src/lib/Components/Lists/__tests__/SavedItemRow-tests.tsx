import React from "react"
import * as renderer from "react-test-renderer"

import SavedItemRow from "../SavedItemRow"

import { Theme } from "@artsy/palette"

const props = {
  href: "/artist/petra-collins",
  name: "Petra Collins",
  image: { url: "https://d32dm0rphc51dk.cloudfront.net/GeP7pPxLcVRva8UTzBBGXQ/large.jpg" },
}

it("renders correctly", () => {
  const tree = renderer
    .create(
      <Theme>
        <SavedItemRow {...props} />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
