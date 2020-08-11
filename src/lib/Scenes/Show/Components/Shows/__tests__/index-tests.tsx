import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { NearbyShows as _nearbyShows } from "../../../__fixtures__/NearbyShowsFixture"
import { Shows } from "../index"

it("renders without throwing an error", () => {
  renderWithWrappers(<Shows show={data as any} />)
})

const data = {
  city: "New York",
  nearbyShows: _nearbyShows,
}
