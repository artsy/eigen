import { storiesOf } from "@storybook/react-native"
import { RelayStubProvider } from "lib/tests/RelayStubProvider"
import React from "react"
import { ArtworkTombstone } from "../ArtworkTombstone"

storiesOf("Artwork/Components")
  .add("Tombstone with 1 artist", () => {
    return (
      <RelayStubProvider>
        <ArtworkTombstone
          artwork={
            {
              title: "Hello im a title",
              medium: "Painting",
              date: "1992",
              artists: [
                {
                  name: "Andy Warhol",
                  href: "/artist/andy-warhol",
                  id: "1234",
                  gravityID: "andy-warhol",
                  is_followed: false,
                },
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
      </RelayStubProvider>
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
              { name: "Alex Katz", href: "/artist/alex-katz", id: "4354", gravityID: "alex-katz", is_followed: false },
              {
                name: "Pablo Picasso",
                href: "/artist/pablo-picasso",
                id: "3433",
                gravityID: "pablo-picasso",
                is_followed: false,
              },
              { name: "Banksy", href: "/artist/banksy", id: "3468", gravityID: "banksy", is_followed: false },
              {
                name: "Barbara Kruger",
                href: "/artist/barbara-kruger",
                id: "9874",
                gravityID: "barbara-kruger",
                is_followed: false,
              },
              {
                name: "Robert Trundelbed Bananahammock Verylongname",
                href: "/artist/some-rando",
                id: "9874",
                gravityID: "some-rando",
                is_followed: false,
              },
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
              {
                name: "Andy Warhol",
                href: "/artist/andy-warhol",
                id: "1234",
                gravityID: "andy-warhol",
                is_followed: false,
              },
              { name: "Alex Katz", href: "/artist/alex-katz", id: "4354", gravityID: "alex-katz", is_followed: false },
              {
                name: "Pablo Picasso",
                href: "/artist/pablo-picasso",
                id: "3433",
                gravityID: "pablo-picasso",
                is_followed: false,
              },
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
