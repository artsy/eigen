import React from "react"
import * as renderer from "react-test-renderer"

import Header from "../Header"

it("renders properly", () => {
  const sale = {
    name: "The Awesome Sale",
    cover_image: {
      href: "http://example.com/some/image.jpg",
    },
  }
  const header = renderer.create(<Header sale={sale} showImage={false} />).toJSON()
  expect(header).toMatchSnapshot()
})
