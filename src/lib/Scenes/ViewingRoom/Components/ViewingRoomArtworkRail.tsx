import { Flex, Spacer } from "@artsy/palette"
import { ViewingRoomArtworkRail_viewingRoomArtworks } from "__generated__/ViewingRoomArtworkRail_viewingRoomArtworks.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"

interface ViewingRoomArtworkRailProps {
  viewingRoomArtworks: ViewingRoomArtworkRail_viewingRoomArtworks
}

const ArtworkCard = styled.TouchableHighlight`
  border-radius: 2px;
  overflow: hidden;
`

export const ViewingRoomArtworkRail: React.FC<ViewingRoomArtworkRailProps> = props => {
  const artworks = props.viewingRoomArtworks.artworks! /* STRICTNESS_MIGRATION */.edges! /* STRICTNESS_MIGRATION */
  const totalCount = props.viewingRoomArtworks.artworks! /* STRICTNESS_MIGRATION */
    .totalCount! /* STRICTNESS_MIGRATION */
  const navRef = useRef()
  const pluralizedArtworksCount = totalCount === 1 ? "artwork" : "artworks"

  return (
    <View ref={navRef as any /* STRICTNESS_MIGRATION */}>
      <Flex>
        <SectionTitle
          title={`${totalCount} ${pluralizedArtworksCount}`}
          onPress={() =>
            SwitchBoard.presentNavigationViewController(
              navRef.current!,
              "/viewing-room/this-is-a-test-viewing-room-id/artworks"
            )
          }
        />
        <AboveTheFoldFlatList
          horizontal
          style={{ height: 100 }}
          ItemSeparatorComponent={() => <Spacer mr={0.5}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={artworks}
          initialNumToRender={4}
          windowSize={3}
          renderItem={({ item }) => (
            <ArtworkCard
              onPress={() =>
                SwitchBoard.presentNavigationViewController(
                  navRef.current!,
                  item?.node?.href! /* STRICTNESS_MIGRATION */
                )
              }
            >
              <OpaqueImageView imageURL={item?.node?.image?.url! /* STRICTNESS_MIGRATION */} width={100} height={100} />
            </ArtworkCard>
          )}
          keyExtractor={(item, index) => String(item?.node?.href ?? index)}
        />
      </Flex>
    </View>
  )
}

export const ViewingRoomArtworkRailContainer = createFragmentContainer(ViewingRoomArtworkRail, {
  viewingRoomArtworks: graphql`
    fragment ViewingRoomArtworkRail_viewingRoomArtworks on ViewingRoom {
      artworks: artworksConnection(first: 5) {
        totalCount
        edges {
          node {
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
  `,
})
