import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"

import Header from "../ArtistHeader"

it("renders without throwing an error", () => {
  const artist = {
    internalID: "some-id",
    id: "marcel-duchamp",
    name: "Marcel Duchamp",
    nationality: "French",
    birthday: "11/17/1992",
    counts: {
      follows: 22,
    },
  }
  renderWithWrappers(<Header artist={artist as any} />)
})
