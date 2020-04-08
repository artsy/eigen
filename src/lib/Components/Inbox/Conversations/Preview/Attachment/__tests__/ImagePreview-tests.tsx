import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ImagePreview } from "../ImagePreview"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <ImagePreview attachment={attachment as any} />
    </Theme>
  )
})

const attachment = {
  id: "cats",
  download_url: "/path/to/cats.jpg",
}
