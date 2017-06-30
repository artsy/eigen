import * as React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

import ImagePreview from "../../Previews/ImagePreview"

it("renders correctly", () => {
  const tree = renderer.create(<ImagePreview imageAttachment={attachment} />)
  expect(tree).toMatchSnapshot()
})

const attachment = {
  download_url: "/path/to/cats.jpg",
}
