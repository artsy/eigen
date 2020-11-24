import { ViewingRoomsHomeRail_regular$key } from "__generated__/ViewingRoomsHomeRail_regular.graphql"
import { ViewingRoomsHomeRailQuery } from "__generated__/ViewingRoomsHomeRailQuery.graphql"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Schema } from "lib/utils/track"
import _ from "lodash"
import { Flex, Sans, Spacer } from "palette"
import { MediumCard, Touchable } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { useTracking } from "react-tracking"
import { graphql, useFragment, useQuery } from "relay-hooks"
import { featuredFragment, FeaturedRail, tracks as featuredTracks } from "./ViewingRoomsListFeatured"
import { tagForStatus } from "./ViewingRoomsListItem"

interface ViewingRoomsHomeRailProps {
  featured: ViewingRoomsListFeatured_featured$key
}

export const ViewingRoomsHomeRail: React.FC<ViewingRoomsHomeRailProps> = (props) => {
  const { trackEvent } = useTracking()

  const featuredData = useFragment(featuredFragment, props.featured)
  const featuredLength = extractNodes(featuredData).length

  return (
    <View>
      <Flex mx="2">
        <SectionTitle
          title="Viewing rooms"
          onPress={() => {
            trackEvent(tracks.tappedViewingRoomsHeader())
            navigate("/viewing-rooms")
          }}
          RightButtonContent={() => (
            <Sans size="3" color="black60">
              View all
            </Sans>
          )}
        />
      </Flex>
      {featuredLength > 0 ? (
        <FeaturedRail
          featured={props.featured}
          trackInfo={{ screen: Schema.PageNames.Home, ownerType: Schema.OwnerEntityTypes.Home }}
        />
      ) : (
        <ViewingRoomsRegularRailQueryRenderer
          trackInfo={{ screen: Schema.PageNames.Home, ownerType: Schema.OwnerEntityTypes.Home }}
        />
      )}
    </View>
  )
}

const query = graphql`
  query ViewingRoomsHomeRailQuery {
    ...ViewingRoomsHomeRail_regular
  }
`

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <Flex ml="2">
      <Flex flexDirection="row">
        {_.times(4).map((i) => (
          <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
        ))}
      </Flex>
    </Flex>
  </ProvidePlaceholderContext>
)

export const ViewingRoomsRegularRailQueryRenderer: React.FC<{
  trackInfo?: { screen: string; ownerType: string }
}> = ({ trackInfo }) => {
  const { props, error } = useQuery<ViewingRoomsHomeRailQuery>(query, {}, { networkCacheConfig: { force: true } })

  if (props) {
    return <ViewingRoomsRegularRail query={props} trackInfo={trackInfo} />
  }
  if (error) {
    throw error
  }

  return <Placeholder />
}

const fragment = graphql`
  fragment ViewingRoomsHomeRail_regular on Query {
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

interface ViewingRoomsRegularRailProps {
  query: ViewingRoomsHomeRail_regular$key
  trackInfo?: { screen: string; ownerType: string }
}

export const ViewingRoomsRegularRail: React.FC<ViewingRoomsRegularRailProps> = ({ trackInfo, ...props }) => {
  const queryData = useFragment(fragment, props.query)
  const regular = extractNodes(queryData.viewingRooms)

  const { trackEvent } = useTracking()

  return (
    <Flex>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer ml="2" />}
        ListFooterComponent={() => <Spacer ml="2" />}
        data={regular}
        keyExtractor={(item) => `${item.internalID}`}
        renderItem={({ item }) => {
          const tag = tagForStatus(item.status, item.distanceToOpen, item.distanceToClose)
          return (
            <Touchable
              onPress={() => {
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
        ItemSeparatorComponent={() => <Spacer ml="2" />}
      />
    </Flex>
  )
}

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
