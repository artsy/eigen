import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { CityView } from "../City"

describe(CityView, () => {
  it("renders empty without a city prop", () => {
    expect(renderer.create(<CityView citySlug="new-york-us" tracking={null} />)).toMatchInlineSnapshot(`null`)
  })
})
