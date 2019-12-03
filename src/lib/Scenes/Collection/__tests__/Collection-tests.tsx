import React from "react"
import * as renderer from "react-test-renderer"
import { Collection } from "../Collection"
import { CollectionFixture } from "../Components/__fixtures__/index"

describe("Collection", () => {
  let props
  beforeEach(() => {
    props = {
      ...CollectionFixture,
    }
  })

  it("Renders collection  correctly", () => {
    const component = renderer.create(<Collection {...props} />)
    expect(component).toMatchSnapshot()
  })
})
