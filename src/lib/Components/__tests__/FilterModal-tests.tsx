import { Theme } from "@artsy/palette"
import { FilterModal } from "lib/Components/FilterModal"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"

it("renders a snapshot of the filter artworks modal", () => {
  let props

  props = {
    visible: true,
  }

  const tree = renderer
    .create(
      <Theme>
        <FilterModal {...props} />
      </Theme>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
