import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { Shows } from "../index"
import { NearbyShows as _nearbyShows } from "../nearbyShows"

it("looks correct when rendered", () => {
  const data = {
    city: "New York",
    nearbyShows: _nearbyShows,
  }
  const comp = renderer.create(<Shows show={data as any} />)
  expect(comp).toMatchSnapshot()
})
