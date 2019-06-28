import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkDetails } from "../ArtworkDetails"

storiesOf("Artwork/Components").add("Details", () => {
  return (
    <ArtworkDetails
      artwork={{
        " $refType": null,
        category: "Oil on canvas",
        conditionDescription: null,
        signature: null,
        signatureInfo: null,
        certificateOfAuthenticity: null,
        framed: null,
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      }}
    />
  )
})
