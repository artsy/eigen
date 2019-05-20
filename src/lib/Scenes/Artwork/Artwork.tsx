import { Artwork_artwork } from "__generated__/Artwork_artwork.graphql"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { Text, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./Components/ArtworkTombstone"

interface Props {
  artwork: Artwork_artwork
}

export class Artwork extends React.Component<Props> {
  render() {
    const { artwork } = this.props
    return (
      <View style={{ backgroundColor: "white" }}>
        <Text>{this.props.artwork.title}</Text>
        <ArtworkTombstone artwork={artwork} />
      </View>
    )
  }
}

export const ArtworkContainer = createFragmentContainer(Artwork, {
  artwork: graphql`
    fragment Artwork_artwork on Artwork {
      title
      ...ArtworkTombstone_artwork
    }
  `,
})

export const ArtworkRenderer: React.SFC<{ artworkID: string }> = ({ artworkID }) => {
  return (
    <QueryRenderer<ArtworkQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtworkQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            ...Artwork_artwork
          }
        }
      `}
      variables={{ artworkID }}
      render={renderWithLoadProgress(ArtworkContainer)}
    />
  )
}
