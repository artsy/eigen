import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ImagePreviewContainer } from "../ImagePreview"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <ImagePreviewContainer attachment={attachment as any} />
    </Theme>
  )
})

const attachment = {
  id: "cats",
  download_url: "/path/to/cats.jpg",
}
