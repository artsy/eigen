import { Flex, Spacer, Touchable } from "@artsy/palette-mobile"
import { ViewingRoomsHomeRailQuery } from "__generated__/ViewingRoomsHomeRailQuery.graphql"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { MediumCard } from "app/Components/Cards"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { Schema } from "app/utils/track"
import { times } from "lodash"
import React, { memo, Suspense } from "react"
import { FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import {
  featuredFragment,
  FeaturedRail,
  tracks as featuredTracks,
} from "./ViewingRoomsListFeatured"
import { tagForStatus } from "./ViewingRoomsListItem"

interface ViewingRoomsHomeMainRailProps {
  featured: ViewingRoomsListFeatured_featured$key
  title: string
}

export const ViewingRoomsHomeMainRail: React.FC<ViewingRoomsHomeMainRailProps> = memo(
  ({ featured, title }) => {
    const { trackEvent } = useTracking()

    const featuredData = useFragment(featuredFragment, featured)
    const featuredLength = extractNodes(featuredData).length

    return (
      <Flex>
        <Flex mx={2}>
          <SectionTitle
            title={title}
            onPress={() => {
              trackEvent(tracks.tappedViewingRoomsHeader())
              navigate("/viewing-rooms")
            }}
          />
        </Flex>
        {featuredLength > 0 ? (
          <FeaturedRail
            featured={featured}
            trackInfo={{ screen: Schema.PageNames.Home, ownerType: Schema.OwnerEntityTypes.Home }}
          />
        ) : (
          <Suspense fallback={<ViewingRoomsRailPlaceholder />}>
            <ViewingRoomsHomeRail
              trackInfo={{ screen: Schema.PageNames.Home, ownerType: Schema.OwnerEntityTypes.Home }}
            />
          </Suspense>
        )}
      </Flex>
    )
  }
)

export const ViewingRoomsRailPlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex ml={2} testID="viewing-room-rail-placeholder">
      <Flex flexDirection="row">
        {times(4).map((i) => (
          <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
        ))}
      </Flex>
    </Flex>
  </ProvidePlaceholderContext>
)

interface ViewingRoomsHomeRailProps {
  trackInfo?: { screen: string; ownerType: string }
}

export const ViewingRoomsHomeRail: React.FC<ViewingRoomsHomeRailProps> = ({ trackInfo }) => {
  const queryData = useLazyLoadQuery<ViewingRoomsHomeRailQuery>(ViewingRoomsHomeRailMainQuery, {})
  const regular = extractNodes(queryData.viewingRooms)
  const { trackEvent } = useTracking()

  return (
    <Flex>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={() => <Spacer x={2} />}
        data={regular}
        initialNumToRender={isTablet() ? 10 : 5}
        keyExtractor={(item) => `${item.internalID}`}
        renderItem={({ item }) => {
          const tag = tagForStatus(item.status, item.distanceToOpen, item.distanceToClose)
          return (
            <Touchable
              onPress={() => {
                if (!!item.slug) {
                  trackEvent(
                    trackInfo
                      ? featuredTracks.tappedFeaturedViewingRoomRailItemFromElsewhere(
                          item.internalID,
                          item.slug,
                          trackInfo.screen,
                          trackInfo.ownerType
                        )
                      : featuredTracks.tappedFeaturedViewingRoomRailItem(item.internalID, item.slug)
                  )
                  navigate(`/viewing-room/${item.slug}`)
                }
              }}
            >
              <MediumCard
                title={item.title}
                subtitle={item?.partner?.name}
                image={item.heroImage?.imageURLs?.normalized ?? ""}
                tag={tag}
              />
            </Touchable>
          )
        }}
        ItemSeparatorComponent={() => <Spacer x={2} />}
      />
    </Flex>
  )
}

const ViewingRoomsHomeRailMainQuery = graphql`
  query ViewingRoomsHomeRailQuery {
    viewingRooms(first: 10) {
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
          artworksConnection(first: 2) {
            edges {
              node {
                image {
                  square: url(version: "square")
                  regular: url(version: "larger")
                }
              }
            }
          }
        }
      }
    }
  }
`

const tracks = {
  tappedViewingRoomsHeader: () => ({
    action: Schema.ActionNames.TappedViewingRoomGroup,
    context_module: Schema.ContextModules.FeaturedViewingRoomsRail,
    context_screen: Schema.PageNames.Home,
    context_screen_owner_type: Schema.OwnerEntityTypes.Home,
    destination_screen_owner_type: Schema.PageNames.ViewingRoomsList,
    type: "header",
  }),
}
