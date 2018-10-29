import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import { ShallowRenderer } from "react-test-renderer/shallow"
import { Artworks } from "../index"

it("looks correct when rendered", () => {
  const artwork = [{ id: "12345" }]
  const comp = renderer.create(
    <Artworks>
      <GenericGrid artworks={artwork} />
    </Artworks>
  )
  expect(comp).toMatchSnapshot()
})
