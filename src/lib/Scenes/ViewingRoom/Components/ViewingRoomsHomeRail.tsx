import { Flex, Sans } from "@artsy/palette"
import { ViewingRoomsHomeRail_regular$key } from "__generated__/ViewingRoomsHomeRail_regular.graphql"
import { ViewingRoomsHomeRailQuery } from "__generated__/ViewingRoomsHomeRailQuery.graphql"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { View } from "react-native"
import { useTracking } from "react-tracking"
import { graphql, useFragment, useQuery } from "relay-hooks"
import { featuredFragment, FeaturedRail } from "./ViewingRoomsListFeatured"

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

const Placeholder = () => <Flex />

export const ViewingRoomsRegularRailQueryRenderer = () => {
  const { props, error } = useQuery<ViewingRoomsHomeRailQuery>(query, {}, { networkCacheConfig: { force: true } })
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
    viewingRooms(first: 15) {
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
  console.log(`wowow ${JSON.stringify(regular)}`)
  return (
    <Flex>
      <Sans size="3">start</Sans>
      {regular.map(r => (
        <Sans size="3">{r.slug}</Sans>
      ))}
      <Sans size="3">end</Sans>
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
