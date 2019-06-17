import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkAvailability } from "../ArtworkAvailability"

storiesOf("Artwork/Components").add("Availability", () => {
  return <ArtworkAvailability artwork={{ id: "Blah", _id: "HI", availability: "On Loan", " $refType": null }} />
})
