import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import { navigate } from "app/navigation/navigate"
import { RailScrollProps } from "app/Scenes/Home/Components/types"
import { extractNodes } from "app/utils/extractNodes"
import { Schema } from "app/utils/track"
import _ from "lodash"
import { Spacer } from "palette"
import { MediumCard, Touchable } from "palette"
import React, { useImperativeHandle, useRef } from "react"
import { FlatList, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { tagForStatus } from "./ViewingRoomsListItem"

export const featuredFragment = graphql`
  fragment ViewingRoomsListFeatured_featured on ViewingRoomConnection {
    edges {
      node {
        internalID
        title
        slug
        heroImage: image {
          imageURLs {
            normalized
          }
        }
        status
        distanceToOpen(short: true)
        distanceToClose(short: true)
        partner {
          name
        }
      }
    }
  }
`

interface FeaturedRailProps {
  featured: ViewingRoomsListFeatured_featured$key
  trackInfo?: { screen: string; ownerType: string }
}

export const FeaturedRail: React.FC<FeaturedRailProps & Partial<RailScrollProps>> = ({
  scrollRef,
  trackInfo,
  ...props
}) => {
  const featuredData = useFragment(featuredFragment, props.featured)
  const featured = extractNodes(featuredData)
  const { trackEvent } = useTracking()
  const listRef = useRef<FlatList<any>>(null)
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0 }),
  }))

  return (
    <View>
      <AboveTheFoldFlatList
        ListHeaderComponent={() => <Spacer ml="2" />}
        ListFooterComponent={() => <Spacer ml="2" />}
        horizontal
        listRef={listRef}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={2}
        keyExtractor={(item) => item.internalID}
        data={featured}
        ItemSeparatorComponent={() => <Spacer ml={15} />}
        renderItem={({ item }) => {
          const tag = tagForStatus(item.status, item.distanceToOpen, item.distanceToClose)
          return (
            <Touchable
              onPress={() => {
                trackEvent(
                  trackInfo
                    ? tracks.tappedFeaturedViewingRoomRailItemFromElsewhere(
                        item.internalID,
                        item.slug,
                        trackInfo.screen,
                        trackInfo.ownerType
                      )
                    : tracks.tappedFeaturedViewingRoomRailItem(item.internalID, item.slug)
                )
                navigate(`/viewing-room/${item.slug!}`)
              }}
            >
              <MediumCard
                title={item.title}
                subtitle={item.partner!.name!}
                image={item.heroImage?.imageURLs?.normalized ?? ""}
                tag={tag}
              />
            </Touchable>
          )
        }}
      />
    </View>
  )
}

export const tracks = {
  tappedFeaturedViewingRoomRailItem: (vrId: string, vrSlug: string) => ({
    action: Schema.ActionNames.TappedViewingRoomGroup,
    context_module: Schema.ContextModules.FeaturedViewingRoomsRail,
    context_screen: Schema.PageNames.ViewingRoomsList,
    context_screen_owner_type: Schema.OwnerEntityTypes.Home,
    destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    destination_screen_owner_id: vrId,
    destination_screen_owner_slug: vrSlug,
    type: "thumbnail",
  }),
  tappedFeaturedViewingRoomRailItemFromElsewhere: (
    vrId: string,
    vrSlug: string,
    screen: string,
    ownerType: string
  ) => ({
    action: Schema.ActionNames.TappedViewingRoomGroup,
    context_module: Schema.ContextModules.FeaturedViewingRoomsRail,
    context_screen: screen,
    context_screen_owner_type: ownerType,
    destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    destination_screen_owner_id: vrId,
    destination_screen_owner_slug: vrSlug,
    type: "thumbnail",
  }),
}
