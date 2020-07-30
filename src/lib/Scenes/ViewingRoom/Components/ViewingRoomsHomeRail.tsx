import { Flex, Sans } from "@artsy/palette"
import { ViewingRoomsListFeatured_featured$key } from "__generated__/ViewingRoomsListFeatured_featured.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { View } from "react-native"
import { useTracking } from "react-tracking"
import { graphql, useFragment } from "relay-hooks"
import { featuredFragment, FeaturedRail } from "./ViewingRoomsListFeatured"

interface ViewingRoomsHomeRailProps {
  featured: ViewingRoomsListFeatured_featured$key
}

// const fragment = graphql`
//   fragment ViewingRoomsListFeatured_regular on ViewingRoomConnection {
//     edges {
//       node {
//         internalID
//         title
//         slug
//         heroImage: image {
//           imageURLs {
//             normalized
//           }
//         }
//         status
//         distanceToOpen(short: true)
//         distanceToClose(short: true)
//         partner {
//           name
//         }
//       }
//     }
//   }
// `

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
        <Flex />
      )}
    </View>
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
