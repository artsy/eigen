import { Box, color, Flex, Sans, Spacer } from "@artsy/palette"
import { ViewingRoomsHomeRail_regular$key } from "__generated__/ViewingRoomsHomeRail_regular.graphql"
import { ViewingRoomsHomeRailQuery } from "__generated__/ViewingRoomsHomeRailQuery.graphql"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { Schema } from "lib/utils/track"
import _ from "lodash"
import { MediumCard } from "palette"
import React, { useRef } from "react"
import { FlatList, TouchableHighlight, View } from "react-native"
import { useTracking } from "react-tracking"
import { graphql, useFragment, useQuery } from "relay-hooks"
import { featuredFragment, FeaturedRail } from "./ViewingRoomsListFeatured"
import { tagForStatus, ViewingRoomsListItem } from "./ViewingRoomsListItem"

interface ViewingRoomsHomeRailProps {
  featured: ViewingRoomsListFeatured_featured$key
}

export const ViewingRoomsHomeRail: React.FC<ViewingRoomsHomeRailProps> = props => {
  const { trackEvent } = useTracking()
  const navRef = useRef<any>(null)

  const featuredData = useFragment(featuredFragment, props.featured)
  const featuredLength = extractNodes(featuredData).length

  return (
    <View ref={navRef}>
      <Flex mx="2">
        <SectionTitle
          title="Viewing Rooms"
          onPress={() => {
            trackEvent(tracks.tappedViewingRoomsHeader())
            SwitchBoard.presentNavigationViewController(navRef.current, "/viewing-rooms")
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
        <ViewingRoomsRegularRailQueryRenderer />
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
    <Flex mx="2" mt="4" flexDirection="row">
      {_.times(2).map(i => (
        <Box key={i}>
          <PlaceholderBox width="100%" height={220} />
          <PlaceholderText width={120 + Math.random() * 100} marginTop={10} />
          <PlaceholderText width={80 + Math.random() * 100} marginTop={5} />
        </Box>
      ))}
    </Flex>
  </ProvidePlaceholderContext>
)

export const ViewingRoomsRegularRailQueryRenderer = () => {
  const { props, error } = useQuery<ViewingRoomsHomeRailQuery>(query, {}, { networkCacheConfig: { force: true } })

  // return <Placeholder />
  if (props) {
    return <ViewingRoomsRegularRail query={props} />
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
}

export const ViewingRoomsRegularRail: React.FC<ViewingRoomsRegularRailProps> = props => {
  const queryData = useFragment(fragment, props.query)
  const regular = extractNodes(queryData.viewingRooms)

  const navRef = useRef<any>(null)
  const { trackEvent } = useTracking()

  return (
    <Flex ref={navRef}>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer ml="2" />}
        ListFooterComponent={() => <Spacer ml="2" />}
        data={regular}
        keyExtractor={item => `${item.internalID}`}
        renderItem={({ item }) => {
          const tag = tagForStatus(item.status, item.distanceToOpen, item.distanceToClose)
          return (
            <TouchableHighlight
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
                SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${item.slug!}`)
              }}
              underlayColor={color("white100")}
              activeOpacity={0.8}
            >
              <MediumCard
                title={item.title}
                subtitle={item.partner!.name!}
                image={item.heroImage?.imageURLs?.normalized ?? ""}
                tag={tag}
              />
            </TouchableHighlight>
          )
        }}
        // renderItem={({ item }) => {
        //   return (
        //     <Flex width={310} height={260}>
        //       <ViewingRoomsListItem item={item} />
        //     </Flex>
        //   )
        // }}
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
