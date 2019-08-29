import { storiesOf } from "@storybook/react-native"
import { ArtworkTombstone_artwork } from "__generated__/ArtworkTombstone_artwork.graphql"
// import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import React from "react"
import { graphql } from "react-relay"
import { ArtworkTombstoneFragmentContainer } from "../ArtworkTombstone"

const MockArtworkTombstone = ({ artwork }: { artwork: ArtworkTombstone_artwork }) => {
  return (
    <MockRelayRenderer
      Component={ArtworkTombstoneFragmentContainer}
      mockData={{ artwork }}
      query={graphql`
        query ArtworkTombstoneStoryQuery {
          artwork(id: "unused") {
            ...ArtworkTombstone_artwork
          }
        }
      `}
    />
  )
}

const artworkTombstoneArtwork = {
  // ...ArtworkFixture,
  title: "Hello im a title",
  medium: "Painting",
  date: "1992",
  artists: [
    {
      name: "Andy Warhol",
      href: "/artist/andy-warhol",
      id: "1234",
      slug: "andy-warhol",
      is_followed: false,
      " $fragmentRefs": null,
    },
    {
      name: "Pablo Picasso",
      href: "/artist/pablo-picasso",
      id: "12347",
      gravityID: "pablo-picasso",
      is_followed: false,
      " $fragmentRefs": null,
    },
    {
      name: "Some Person Witha Really Extremely SuperVeryVery Longname",
      href: "/artist/very-long-name",
      id: "12348",
      gravityID: "very-long-name",
      is_followed: false,
      " $fragmentRefs": null,
    },
    {
      name: "Alex Katz",
      href: "/artist/alex-katz",
      id: "12346",
      gravityID: "alex-katz",
      is_followed: false,
      " $fragmentRefs": null,
    },
    {
      name: "Barbara Kruger",
      href: "/artist/barbara-kruger",
      id: "12349",
      gravityID: "barbara-kruger",
      is_followed: false,
      " $fragmentRefs": null,
    },
  ],
  cultural_maker: null,
  dimensions: { in: "15 × 20 in", cm: "38.1 × 50.8 cm" },
  edition_of: "Edition 100/200",
  attribution_class: { shortDescription: "This is an edition of something" },
  " $refType": null,
}
storiesOf("Artwork/Components").add("Tombstone", () => {
  return <MockArtworkTombstone artwork={artworkTombstoneArtwork as any} />
})
