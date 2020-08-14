import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import PDFPreview from "../PDFPreview"

it("renders without throwing an error", () => {
  renderWithWrappers(<PDFPreview attachment={attachment as any} />)
})

const attachment = {
  id: "cats",
  file_name: "This is a great PDF telling you all about cats",
}
