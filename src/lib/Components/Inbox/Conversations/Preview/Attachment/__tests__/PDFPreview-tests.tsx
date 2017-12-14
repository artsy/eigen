import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import PDFPreview from "../PDFPreview"

it("renders correctly", () => {
  const tree = renderer.create(<PDFPreview attachment={attachment} />)
  expect(tree).toMatchSnapshot()
})

const attachment = {
  id: "cats",
  file_name: "This is a great PDF telling you all about cats",
}
