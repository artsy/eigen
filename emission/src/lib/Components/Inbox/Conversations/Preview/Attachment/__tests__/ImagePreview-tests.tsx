import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ImagePreview } from "../ImagePreview"

import { Theme } from "@artsy/palette"

it("renders correctly", () => {
  const tree = renderer.create(
    <Theme>
      <ImagePreview attachment={attachment as any} />
    </Theme>
  )
  expect(tree).toMatchSnapshot()
})

const attachment = {
  id: "cats",
  download_url: "/path/to/cats.jpg",
}
