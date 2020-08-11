import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import ShowPreview from "../ShowPreview"

import { Theme } from "@artsy/palette"

it("renders without throwing an error", () => {
  renderWithWrappers(
    <Theme>
      <ShowPreview show={show as any} />
    </Theme>
  )
})

const show = {
  name: "Catty Show",
  id: "slugID",
  internalID: "mongoID",
  cover_image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
  partner: {
    name: "Catty Partner",
  },
  fair: null,
}
