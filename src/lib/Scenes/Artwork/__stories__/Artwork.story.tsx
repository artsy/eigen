import { storiesOf } from "@storybook/react-native"
import React from "react"

import { ArtworkRenderer } from "../Artwork"
import { ArtworkTombstone } from "../Components/ArtworkTombstone"

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
  .add("tombstone with artist", () => {
    return (
      <ArtworkTombstone
        artwork={
          {
            title: "Hello im a title",
            medium: "Painting",
            date: "1992",
            artists: [{ name: "Andy Warhol", __id: "1234", href: "/artist/pablo-picasso" }],
            cultural_maker: null,
            dimensions: {
              in: "15 × 20 in",
              cm: "38.1 × 50.8 cm",
            },
            edition_of: "Edition 100/200",
            attribution_class: {
              short_description: "This is an edition of something",
            },
          } as any
        }
      />
    )
  })
  .add("tombstone with artists", () => {
    return (
      <ArtworkTombstone
        artwork={
          {
            title: "Hello im a title",
            medium: "Painting",
            date: "1992",
            artists: [
              { name: "Andy Warhol", __id: "1234", href: "/artist/pablo-picasso" },
              { name: "Alex Katz", __id: "6789", href: "/artist/alex-katz" },
            ],
            cultural_maker: null,
            dimensions: {
              in: "15 × 20 in",
              cm: "38.1 × 50.8 cm",
            },
            edition_of: "Edition 100/200",
            attribution_class: {
              short_description: "This is an edition of something",
            },
          } as any
        }
      />
    )
  })
  .add("tombstone with cultural maker", () => {
    return (
      <ArtworkTombstone
        artwork={
          {
            title: "Hello im a title",
            medium: "Painting",
            date: "1992",
            artists: [],
            cultural_maker: "some guy idk",
            dimensions: {
              in: "15 × 20 in",
              cm: "38.1 × 50.8 cm",
            },
            edition_of: "Edition 100/200",
            attribution_class: {
              short_description: "This is an edition of something",
            },
          } as any
        }
      />
    )
  })
