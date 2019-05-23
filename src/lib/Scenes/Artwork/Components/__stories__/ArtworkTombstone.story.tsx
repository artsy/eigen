import { Theme } from "@artsy/palette"
import { storiesOf } from "@storybook/react-native"
import React from "react"
import { ArtworkTombstone } from "../ArtworkTombstone"

storiesOf("Artwork/Components")
  .addDecorator(storyFn => {
    return <Theme>{storyFn()}</Theme>
  })
  .add("Tombstone with 1 artist", () => {
    return (
      <ArtworkTombstone
        artwork={
          {
            title: "Hello im a title",
            medium: "Painting",
            date: "1992",
            artists: [{ name: "Andy Warhol", href: "/artist/pablo-picasso" }],
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
  .add("Tombstone with many artists", () => {
    return (
      <ArtworkTombstone
        artwork={
          {
            title: "Hello im a title",
            medium: "Painting",
            date: "1992",
            artists: [
              { name: "Andy Warhol", href: "/artist/pablo-picasso" },
              { name: "Alex Katz", href: "/artist/alex-katz" },
              { name: "Pablo Picasso", href: "/artist/pablo-picasso" },
              { name: "Banksy", href: "/artist/banksy" },
              { name: "Robert Trundelbed Bananahammock Verylongname", href: "/artist/banksy" },
              { name: "Barbara Kruger", href: "/artist/barbara-kruger" },
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
  .add("Tombstone with 3 artists", () => {
    return (
      <ArtworkTombstone
        artwork={
          {
            title: "Hello im a title",
            medium: "Painting",
            date: "1992",
            artists: [
              { name: "Andy Warhol", href: "/artist/pablo-picasso" },
              { name: "Alex Katz", href: "/artist/alex-katz" },
              { name: "Pablo Picasso", href: "/artist/pablo-picasso" },
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
