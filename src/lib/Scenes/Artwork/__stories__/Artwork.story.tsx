import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkRenderer } from "../Artwork"

storiesOf("Artwork/Screens")
  .add("Institution", () => {
    return <ArtworkRenderer artworkID="pablo-picasso-le-reve-the-dream" />
  })
  // At some point, this work will probably no longer be eligible for BNMO :shrug:
  .add("BNMO", () => {
    return <ArtworkRenderer artworkID="enrico-baj-portrait-1-from-baj-chez-picasso" />
  })
  // Hopefully this is an artwork in a mocktion that gets recreated in staging each week
  .add("Biddable", () => {
    return <ArtworkRenderer artworkID="pablo-picasso-buste-de-femme-assise-dans-un-fauteuil" />
  })
  .add("With multiple artists", () => {
    return (
      <ArtworkRenderer artworkID="andy-warhol-twenty-years-1977-signed-slash-inscribed-by-leo-exhibition-catalogue-leo-castelli-gallery-1st-edition" />
    )
  })
