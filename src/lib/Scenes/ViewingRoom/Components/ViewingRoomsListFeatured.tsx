import { color, Flex, MediumCard, Spacer } from "@artsy/palette"
import { ViewingRoomsListFeaturedQuery } from "__generated__/ViewingRoomsListFeaturedQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, ProvidePlaceholderContext } from "lib/utils/placeholders"
import _ from "lodash"
import React, { useRef } from "react"
import { FlatList, TouchableHighlight } from "react-native"
import { graphql, useQuery } from "relay-hooks"
import { tagForStatus } from "./ViewingRoomsListItem"

const query = graphql`
  query ViewingRoomsListFeaturedQuery {
    viewingRooms(featured: true) {
      edges {
        node {
          internalID
          title
          slug
          heroImageURL
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

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <Flex flexDirection="row">
      {_.times(2).map(() => (
        <PlaceholderBox width={280} height={370} marginRight={15} />
      ))}
    </Flex>
  </ProvidePlaceholderContext>
)

export const FeaturedRail = () => {
  const { props, error } = useQuery<ViewingRoomsListFeaturedQuery>(query)
  const navRef = useRef(null)

  if (props?.viewingRooms) {
    const featured = extractNodes(props.viewingRooms)
    return (
      <FlatList
        ref={navRef}
        ListHeaderComponent={() => <Spacer ml="2" />}
        ListFooterComponent={() => <Spacer ml="2" />}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.internalID}
        data={featured}
        ItemSeparatorComponent={() => <Spacer ml={15} />}
        renderItem={({ item }) => {
          const tag = tagForStatus(item.status, item.distanceToOpen, item.distanceToClose)
          return (
            <TouchableHighlight
              onPress={() =>
                void SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${item.slug!}`)
              }
              underlayColor={color("white100")}
              activeOpacity={0.8}
            >
              <Flex width={280} height={372}>
                <MediumCard title={item.title} subtitle={item.partner!.name!} image={item.heroImageURL!} tag={tag} />
              </Flex>
            </TouchableHighlight>
          )
        }}
      />
    )
  }
  if (error) {
    throw error
  }

  return <Placeholder />
}
