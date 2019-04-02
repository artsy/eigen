import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { CityView } from "../City"

// @TODO: Increase test coverage for this component by adding test for map bounds https://artsyproduct.atlassian.net/browse/LD-562
describe(CityView, () => {
  it("renders empty without a city prop", () => {
    expect(renderer.create(<CityView citySlug="new-york-us" tracking={null} />)).toMatchInlineSnapshot(`null`)
  })
})
