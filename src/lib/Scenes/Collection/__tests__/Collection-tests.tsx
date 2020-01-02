import { CollectionFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import React from "react"
import * as renderer from "react-test-renderer"
import { Collection } from "../Collection"

describe("Collection", () => {
  let props
  beforeEach(() => {
    props = {
      collection: { ...CollectionFixture },
    }
  })

  it("Renders collection correctly", () => {
    const component = renderer.create(<Collection {...props} />)
    expect(component).toMatchSnapshot()
  })
})
