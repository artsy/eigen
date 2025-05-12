import { ContextModule } from "@artsy/cohesion"
import { Flex, Spacer } from "@artsy/palette-mobile"
import {
  ViewingRoomsHomeRailQuery,
  ViewingRoomsHomeRailQuery$data,
} from "__generated__/ViewingRoomsHomeRailQuery.graphql"
import { MediumCard } from "app/Components/Cards"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useStableShuffle } from "app/utils/hooks/useStableShuffle"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { times, uniqBy } from "lodash"
import React from "react"
import { FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { tracks as featuredTracks } from "./ViewingRoomsListFeatured"
import { tagForStatus } from "./ViewingRoomsListItem"

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
  trackInfo?: { screen: string; ownerType: string; contextModule?: ContextModule }
  onPress?: (
    viewingRoom: ExtractNodeType<ViewingRoomsHomeRailQuery$data["viewingRooms"]>,
    index: number
  ) => void
}

export const ViewingRoomsHomeRail: React.FC<ViewingRoomsHomeRailProps> = ({
  trackInfo,
  onPress,
}) => {
  const queryData = useLazyLoadQuery<ViewingRoomsHomeRailQuery>(ViewingRoomsHomeRailMainQuery, {})

  // assemble a list of all featured viewing rooms, shuffled,
  // plus any regular viewing rooms needed to fill the rail
  const regular = extractNodes(queryData.viewingRooms)
  const featured = extractNodes(queryData.featuredViewingRooms)
  const { shuffled: featuredAndShuffled } = useStableShuffle({ items: featured })
  const combined = featuredAndShuffled.concat(regular)
  const viewingRooms = uniqBy(combined, (vr) => vr.internalID).slice(0, 12)

  const { trackEvent } = useTracking()

  return (
    <Flex>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer x={2} />}
        ListFooterComponent={() => <Spacer x={2} />}
        data={viewingRooms}
        initialNumToRender={isTablet() ? 10 : 5}
        keyExtractor={(item) => `${item.internalID}`}
        renderItem={({ item, index }) => {
          const tag = tagForStatus(item.status, item.distanceToOpen, item.distanceToClose)
          return (
            <RouterLink
              to={`/viewing-room/${item.slug}`}
              onPress={() => {
                if (onPress) {
                  return onPress(item, index)
                }

                if (!!item.slug) {
                  trackEvent(
                    trackInfo
                      ? featuredTracks.tappedFeaturedViewingRoomRailItemFromElsewhere(
                          item.internalID,
                          item.slug,
                          trackInfo.screen,
                          trackInfo.ownerType,
                          trackInfo.contextModule
                        )
                      : featuredTracks.tappedFeaturedViewingRoomRailItem(item.internalID, item.slug)
                  )
                }
              }}
            >
              <MediumCard
                title={item.title}
                subtitle={item?.partner?.name}
                image={item.heroImage?.imageURLs?.normalized ?? ""}
                tag={tag}
              />
            </RouterLink>
          )
        }}
        ItemSeparatorComponent={() => <Spacer x={2} />}
      />
    </Flex>
  )
}

const ViewingRoomsHomeRailMainQuery = graphql`
  query ViewingRoomsHomeRailQuery {
    viewingRooms: viewingRoomsConnection(first: 12) {
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

    featuredViewingRooms: viewingRoomsConnection(first: 12, featured: true) {
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
  }
`
