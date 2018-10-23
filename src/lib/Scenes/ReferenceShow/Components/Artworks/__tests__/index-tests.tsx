import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { Artworks } from "../index"

it("looks correct when rendererd", () => {
  const comp = renderer.create(<Artworks artworks={[]} />)
  expect(comp).toMatchSnapshot()
})
