import * as React from "react"
import * as renderer from "react-test-renderer"

import ImageSelection from "../ImageSelection"

const uri = "https://d32dm0rphc51dk.cloudfront.net/WAlGHmjlxTn3USMllNt4rA/large.jpg"

it("renders correctly at iPhone size", () => {
  const root = <ImageSelection data={[{ image: { uri } }, { image: { uri } }, { image: { uri } }]} />

  const bg = renderer.create(root).toJSON()
  expect(bg).toMatchSnapshot()
})
