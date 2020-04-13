import { Flex, Spacer } from "@artsy/palette"
import { ViewingRoomArtworkRail_viewingRoomArtworks } from "__generated__/ViewingRoomArtworkRail_viewingRoomArtworks.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import React from "react"
import { Alert, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ViewingRoomArtworkRailProps {
  viewingRoomArtworks: ViewingRoomArtworkRail_viewingRoomArtworks
}

const ArtworkCard = styled.TouchableHighlight`
  border-radius: 2px;
  overflow: hidden;
`

export class ViewingRoomArtworkRail extends React.Component<ViewingRoomArtworkRailProps> {
  render() {
    const artworks = this.props.viewingRoomArtworks.artworks.edges
    const images = artworks.map(artwork => artwork.node.artwork.image)
    return (
      <View>
        <Flex>
          <SectionTitle title="# artworks" onPress={() => {}} />
        </Flex>
        <AboveTheFoldFlatList
          horizontal
          style={{ height: 100 }}
          ItemSeparatorComponent={() => <Spacer mr={0.5}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={images}
          initialNumToRender={4}
          windowSize={3}
          renderItem={({ item }) => (
            <ArtworkCard onPress={() => Alert.alert("sup")}>
              <OpaqueImageView imageURL={item.url} width={100} height={100} />
            </ArtworkCard>
          )}
          keyExtractor={(item, index) => String(item.url || index)}
        />
      </View>
    )
  }
}

export const ViewingRoomArtworkRailContainer = createFragmentContainer(ViewingRoomArtworkRail, {
  viewingRoomArtworks: graphql`
    fragment ViewingRoomArtworkRail_viewingRoomArtworks on ViewingRoom {
      artworks: artworksConnection(first: 5) {
        edges {
          node {
            artwork {
              artistNames
              image {
                url(version: "square")
              }
              saleMessage
            }
          }
        }
      }
    }
  `,
})
