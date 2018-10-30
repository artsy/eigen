import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { Location } from "../index"

// TODO: update when relayUntil
xit("looks correct when rendererd", () => {
  const comp = renderer.create(<Location location={{}} />)
  expect(comp).toMatchSnapshot()
})
