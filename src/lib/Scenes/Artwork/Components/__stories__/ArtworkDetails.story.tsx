import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkDetails } from "../ArtworkDetails"

storiesOf("Artwork/Components").add("Details", () => {
  return (
    <ArtworkDetails
      artwork={{
        " $refType": null,
        slug: "lita-albuquerque-sun-and-moon-trajectories-number-5",
        isBiddable: true,
        saleArtwork: { internalID: "some-id" },
        category: "Oil on canvas",
        conditionDescription: null,
        signatureInfo: null,
        certificateOfAuthenticity: { label: "Certificate of Authenticity", details: "Included" },
        framed: { label: "Framed", details: "Not included" },
        series: null,
        publisher: null,
        manufacturer: null,
        image_rights: "Scala / Art Resource, NY / Picasso, Pablo (1881-1973) © ARS, NY",
      }}
    />
  )
})
