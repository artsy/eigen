import { Theme } from "@artsy/palette"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { NearbyShows as _nearbyShows } from "../../../__fixtures__/NearbyShowsFixture"
import { Shows } from "../index"

it("looks correct when rendered", () => {
  const comp = renderer.create(
    <Theme>
      <Shows show={data as any} />
    </Theme>
  )
  expect(comp).toMatchSnapshot()
})

const data = {
  city: "New York",
  nearbyShows: _nearbyShows,
}
