import React from "react"
import * as renderer from "react-test-renderer"

import ImageSelection from "../ImageSelection"

const uri = "https://d32dm0rphc51dk.cloudfront.net/WAlGHmjlxTn3USMllNt4rA/large.jpg"

it("renders correctly at iPhone size", () => {
  const root = <ImageSelection data={[{ image: { uri } }, { image: { uri } }, { image: { uri } }]} />

  const bg = renderer.create(root).toJSON()
  expect(bg).toMatchSnapshot()
})

// describe("data source items", () => {
// xit("includes the camera image", () => {
// const data = []
// const selection = new ImageSelection({ data })
// const ds = selection.dataSourceFromData(data, true)
// expect(ds.getRowData(0, 0)).toEqual("take_photo")
// })

// xit("adds an extra trailing element for iPhone", () => {
// const data = []
// const selection = new ImageSelection({ data })
// const ds = selection.dataSourceFromData(data, false)
// expect(ds.getRowCount()).toEqual(2)
// })

// xit("only adds the photo element for iPad", () => {
// const data = []
// const selection = new ImageSelection({ data })
// const ds = selection.dataSourceFromData(data, true)
// expect(ds.getRowCount()).toEqual(1)
// })
// })

it("updates state on selection", () => {
  const selection = new ImageSelection({ data: [] })
  selection.setState = jest.fn()
  selection.onPressItem("")
  expect(selection.setState).toBeCalled()
})
