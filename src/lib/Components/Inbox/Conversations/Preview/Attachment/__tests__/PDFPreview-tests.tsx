import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import PDFPreview from "../PDFPreview"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <PDFPreview attachment={attachment as any} />
    </Theme>
  )
})

const attachment = {
  id: "cats",
  file_name: "This is a great PDF telling you all about cats",
}
