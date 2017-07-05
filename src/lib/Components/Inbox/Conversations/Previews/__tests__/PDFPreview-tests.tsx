import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import PDFPreview from "../../Previews/PDFPreview"

it("renders correctly", () => {
  const tree = renderer.create(<PDFPreview pdfAttachment={attachment} />)
  expect(tree).toMatchSnapshot()
})

const attachment = {
  file_name: "This is a great PDF telling you all about cats",
}
