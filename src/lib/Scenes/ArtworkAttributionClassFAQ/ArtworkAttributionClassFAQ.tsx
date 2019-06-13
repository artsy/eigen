import { Serif, Theme } from "@artsy/palette"
import { ArtworkAttributionClassFAQ_artworkAttributionClasses } from "__generated__/ArtworkAttributionClassFAQ_artworkAttributionClasses.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  attributionClasses: ArtworkAttributionClassFAQ_artworkAttributionClasses
}

export class ArtworkAttributionClassFAQ extends React.Component<Props> {
  render() {
    console.log("PROPS!!", this.props.attributionClasses)
    return (
      <Theme>
        <Serif size="2">Hello World!</Serif>
      </Theme>
    )
  }
}

export const ArtworkAttributionClassFAQFragmentContainer = createFragmentContainer(ArtworkAttributionClassFAQ, {
  artworkAttributionClasses: graphql`
    fragment ArtworkAttributionClassFAQ_artworkAttributionClasses on AttributionClass {
      name
      long_description
    }
  `,
})

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
