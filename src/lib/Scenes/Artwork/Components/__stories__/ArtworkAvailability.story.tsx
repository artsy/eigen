import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkAvailability } from "../ArtworkAvailability"

storiesOf("Artwork/Components").add("Availability", () => {
  return <ArtworkAvailability artwork={{ availability: "On Loan", " $refType": null }} />
})
