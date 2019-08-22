import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkRenderer } from "../Artwork"

const safeAreaInsets = {
  top: 20,
  left: 0,
  right: 0,
  bottom: 0,
}

storiesOf("Artwork/Screens")
  .add("Institution", () => {
    return <ArtworkRenderer artworkID="pablo-picasso-le-reve-the-dream" safeAreaInsets={safeAreaInsets} />
  })
  // At some point, this work will probably no longer be eligible for BNMO :shrug:
  .add("BNMO", () => {
    return <ArtworkRenderer artworkID="enrico-baj-portrait-1-from-baj-chez-picasso" safeAreaInsets={safeAreaInsets} />
  })
  // Hopefully this is an artwork in a mocktion that gets recreated in staging each week
  .add("Biddable", () => {
    return (
      <ArtworkRenderer
        artworkID="pablo-picasso-buste-de-femme-assise-dans-un-fauteuil"
        safeAreaInsets={safeAreaInsets}
      />
    )
  })
  .add("With multiple artists", () => {
    return (
      <ArtworkRenderer
        artworkID="andy-warhol-twenty-years-1977-signed-slash-inscribed-by-leo-exhibition-catalogue-leo-castelli-gallery-1st-edition"
        safeAreaInsets={safeAreaInsets}
      />
    )
  })
  .add("With dsffsts", () => {
    return <ArtworkRenderer artworkID="alex-katz-sunset-cove-1" safeAreaInsets={safeAreaInsets} />
  })
