import "react-native"

import * as React from "react"
import * as renderer from "react-test-renderer"

import Biography from "../biography"

it("renders properly", () => {
  const gene = {
    description: "Watercolor painting is very nice",
  }
  const biography = renderer.create(<Biography gene={gene} />).toJSON()
  expect(biography).toMatchSnapshot()
})
