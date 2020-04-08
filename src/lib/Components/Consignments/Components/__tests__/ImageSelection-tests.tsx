import React from "react"
import * as renderer from "react-test-renderer"

import ImageSelection from "../ImageSelection"

const uri = "https://d32dm0rphc51dk.cloudfront.net/WAlGHmjlxTn3USMllNt4rA/large.jpg"

it("renders without throwing an error", () => {
  renderer.create(<ImageSelection data={[{ image: { uri } }, { image: { uri } }, { image: { uri } }]} />)
})

it("updates state on selection", () => {
  const selection = new ImageSelection({ data: [] })
  selection.setState = jest.fn()
  selection.onPressItem("")
  expect(selection.setState).toBeCalled()
})
