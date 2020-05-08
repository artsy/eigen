import { Flex, Spacer } from "@artsy/palette"
import { ViewingRoomArtworkRail_viewingRoom } from "__generated__/ViewingRoomArtworkRail_viewingRoom.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface ViewingRoomArtworkRailProps {
  viewingRoom: ViewingRoomArtworkRail_viewingRoom
}

export const ArtworkCard = styled.TouchableHighlight`
  border-radius: 2px;
  overflow: hidden;
`
export const ViewingRoomArtworkRail: React.FC<ViewingRoomArtworkRailProps> = props => {
  const viewingRoom = props.viewingRoom
  const artworks = viewingRoom.artworks! /* STRICTNESS_MIGRATION */.edges! /* STRICTNESS_MIGRATION */
  const totalCount = viewingRoom.artworks! /* STRICTNESS_MIGRATION */.totalCount! /* STRICTNESS_MIGRATION */
  const tracking = useTracking()
  const navRef = useRef()
  const pluralizedArtworksCount = totalCount === 1 ? "artwork" : "artworks"

  return (
    <View ref={navRef as any /* STRICTNESS_MIGRATION */}>
      <Flex>
        <SectionTitle
          title={`${totalCount} ${pluralizedArtworksCount}`}
          onPress={() => {
            tracking.trackEvent(tracks.tappedArtworkGroupHeader(viewingRoom.internalID, viewingRoom.slug))
            SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${viewingRoom.slug}/artworks`)
          }}
        />
        <AboveTheFoldFlatList
          horizontal
          style={{ height: 100 }}
          ItemSeparatorComponent={() => <Spacer mr={0.5}></Spacer>}
          showsHorizontalScrollIndicator={false}
          data={artworks}
          initialNumToRender={5}
          windowSize={3}
          renderItem={({ item }) => (
            <ArtworkCard
              onPress={() => {
                tracking.trackEvent(tracks.tappedArtworkGroupThumbnail(item!.node!.internalID, item!.node!.slug))
                SwitchBoard.presentNavigationViewController(
                  navRef.current!,
                  item?.node?.href! /* STRICTNESS_MIGRATION */
                )
              }}
            >
              <OpaqueImageView imageURL={item?.node?.image?.url} width={100} height={100} />
            </ArtworkCard>
          )}
          keyExtractor={(item, index) => String(item?.node?.href ?? index)}
        />
      </Flex>
    </View>
  )
}

export const tracks = {
  tappedArtworkGroupThumbnail: (internalID: string, slug: string) => {
    return {
      action_name: Schema.ActionNames.TappedArtworkGroup,
      context_module: Schema.ContextModules.ViewingRoomArtworkRail,
      destination_screen: Schema.PageNames.ArtworkPage,
      destination_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
      destination_screen_owner_id: internalID,
      destination_screen_owner_slug: slug,
      type: "thumbnail",
    }
  },
  tappedArtworkGroupHeader: (internalID: string, slug: string) => {
    return {
      action_name: Schema.ActionNames.TappedArtworkGroup,
      context_module: Schema.ContextModules.ViewingRoomArtworkRail,
      destination_screen: Schema.PageNames.ViewingRoomArtworks,
      destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      destination_screen_owner_id: internalID,
      destination_screen_owner_slug: slug,
      type: "header",
    }
  },
}

export const ViewingRoomArtworkRailContainer = createFragmentContainer(ViewingRoomArtworkRail, {
  viewingRoom: graphql`
    fragment ViewingRoomArtworkRail_viewingRoom on ViewingRoom {
      slug
      internalID
      artworks: artworksConnection(first: 5) {
        totalCount
        edges {
          node {
            slug
            internalID
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
