import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { CityView } from "../City"

import { Theme } from "@artsy/palette"

// @TODO: Increase test coverage for this component https://artsyproduct.atlassian.net/browse/LD-562
describe(CityView, () => {
  it("renders empty without a city prop", () => {
    expect(
      renderer.create(
        <Theme>
          <CityView citySlug="new-york-us" tracking={null} />
        </Theme>
      )
    ).toMatchInlineSnapshot(`null`)
  })
})
