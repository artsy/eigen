import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import { ImagePreview } from "../ImagePreview"

it("renders correctly", () => {
  const tree = renderer.create(<ImagePreview attachment={attachment} />)
  expect(tree).toMatchSnapshot()
})

const attachment = {
  id: "cats",
  download_url: "/path/to/cats.jpg",
}
