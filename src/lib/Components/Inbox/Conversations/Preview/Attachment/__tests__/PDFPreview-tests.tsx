import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import PDFPreview from "../PDFPreview"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderer.create(
    <Theme>
      <PDFPreview attachment={attachment as any} />
    </Theme>
  )
})

const attachment = {
  id: "cats",
  file_name: "This is a great PDF telling you all about cats",
}
