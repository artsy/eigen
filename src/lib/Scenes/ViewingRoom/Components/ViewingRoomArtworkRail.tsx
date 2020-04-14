import { Flex, Spacer } from "@artsy/palette"
import { ViewingRoomArtworkRail_viewingRoomArtworks } from "__generated__/ViewingRoomArtworkRail_viewingRoomArtworks.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface ViewingRoomArtworkRailProps {
  viewingRoomArtworks: ViewingRoomArtworkRail_viewingRoomArtworks
}

const ArtworkCard = styled.TouchableHighlight`
  border-radius: 2px;
  overflow: hidden;
`

export const ViewingRoomArtworkRail: React.FC<ViewingRoomArtworkRailProps> = props => {
  const artworks = props.viewingRoomArtworks.artworks.edges
  const finalArtworks = artworks.map(artwork => artwork.node.artwork)
  const navRef = useRef()
  return (
    <View ref={navRef}>
      <Flex>
        <SectionTitle
          title="# artworks"
          onPress={() => {
            console.log("hi")
          }}
        />
      </Flex>
      <AboveTheFoldFlatList
        horizontal
        style={{ height: 100 }}
        ItemSeparatorComponent={() => <Spacer mr={0.5}></Spacer>}
        showsHorizontalScrollIndicator={false}
        data={finalArtworks}
        initialNumToRender={4}
        windowSize={3}
        renderItem={({ item }) => (
          <ArtworkCard onPress={() => SwitchBoard.presentNavigationViewController(navRef.current, item.href)}>
            <OpaqueImageView imageURL={item.image.url} width={100} height={100} />
          </ArtworkCard>
        )}
        keyExtractor={(item, index) => String(item.href || index)}
      />
    </View>
  )
}

export const ViewingRoomArtworkRailContainer = createFragmentContainer(ViewingRoomArtworkRail, {
  viewingRoomArtworks: graphql`
    fragment ViewingRoomArtworkRail_viewingRoomArtworks on ViewingRoom {
      artworks: artworksConnection(first: 5) {
        edges {
          node {
            artwork {
              href
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
