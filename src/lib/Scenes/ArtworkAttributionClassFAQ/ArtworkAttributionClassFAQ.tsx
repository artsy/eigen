import { Serif, Theme } from "@artsy/palette"
import React from "react"

interface Props {
  imaprop?: string
}

export class ArtworkAttributionClassFAQ extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <Serif size="2">Hello World!</Serif>
      </Theme>
    )
  }
}

// export const ArtworkContainer = createFragmentContainer(Artwork, {
//   artwork: graphql`
//     fragment Artwork_artwork on Artwork {
//     }
//   `,
// })

// export const ArtworkRenderer: React.SFC<{ artworkID: string }> = ({ artworkID }) => {
//   return (
//     <QueryRenderer<ArtworkQuery>
//       environment={defaultEnvironment}
//       query={graphql`
//         query ArtworkQuery($artworkID: String!, $excludeArtworkIds: [String!], $screenWidth: Int!) {
//           artwork(id: $artworkID) {
//             ...Artwork_artwork
//           }
//         }
//       `}
//       variables={{
//         artworkID,
//         screenWidth: Dimensions.get("screen").width,
//         excludeArtworkIds: [artworkID],
//       }}
//       render={renderWithLoadProgress(ArtworkContainer)}
//     />
//   )
// }
