import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { ImagePreview } from "./ImagePreview"

it("renders without throwing an error", () => {
  renderWithWrappers(<ImagePreview attachment={attachment as any} />)
})

const attachment = {
  id: "cats",
  downloadURL: "/path/to/cats.jpg",
}
