import { Link, Sans, Serif } from "@artsy/palette"
import { ArtworkTombstone_artwork } from "__generated__/ArtworkTombstone_artwork.graphql"
import artwork from "lib/Components/ArtworkGrids/__tests__/__fixtures__/artwork"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

// export interface ArtworkTombstoneProps {
//   artwork: ArtworkTombstone_artwork
// }

interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork
}

export class ArtworkTombstone extends React.Component<ArtworkTombstoneProps> {
  render() {
    return (
      <>
        <Sans size="2">
          WOOOOO
          {artwork}
        </Sans>
      </>
    )
  }
}

export const ArtworkTombstoneFragmentContainer = createFragmentContainer(ArtworkTombstone, {
  artwork: graphql`
    fragment ArtworkTombstone_artwork on Artwork {
      title
    }
  `,
})

// artists {
//   name
// }
// medium
// dimensions {
//   in
//   cm
// }
// edition_of

// export class ArtworkTombstone extends React.Component<ArtworkTombstoneProps> {
//   render() {
//     const { artwork } = this.props
//     console.log("HELLO!!!!!", this.props)
//     return (
//       <>
//         <Serif size="2">{artwork}</Serif>
//         <Link>
//           <Sans size="2">Follow</Sans>
//         </Link>
//         <Serif size="2">{artwork.title}</Serif>
//       </>
//     )
//   }
// }

// export const ArtworkTombstoneFragmentContainer = createFragmentContainer(ArtworkTombstone, {
//   artwork: graphql`
//     fragment ArtworkTombstone_artwork on Artwork {
//       title
//     }
//   `,
// })

// artists {
//   name
// }
// medium
// dimensions {
//   in
//   cm
// }
// edition_of

// <Serif size="2">{artwork.medium}</Serif>
// <Serif size="2">{artwork.dimensions}</Serif>
// <Serif size="2">{artwork.edition_of}</Serif>
// <Serif size="2">{artwork}</Serif>
