import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { ImagePreview } from "../ImagePreview"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <ImagePreview attachment={attachment as any} />
    </Theme>
  )
})

const attachment = {
  id: "cats",
  download_url: "/path/to/cats.jpg",
}
