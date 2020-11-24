import { Shows_show } from "__generated__/Shows_show.graphql"
import { Flex, Sans } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowItemContainer as ShowItem } from "./Components/ShowItem"

interface Props {
  show: Shows_show
}

export const Shows: React.FC<Props> = ({ show }) => {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const { edges } = show.nearbyShows
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
        <Sans size="4t">More shows nearby</Sans>
      </Flex>
      <FlatList
        horizontal
        data={edges}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.node.id}
        renderItem={({ item }) => {
          return <ShowItem show={item.node as any} />
        }}
      />
    </>
  )
}

export const ShowsContainer = createFragmentContainer(Shows, {
  show: graphql`
    fragment Shows_show on Show {
      nearbyShows: nearbyShowsConnection(first: 20) {
        edges {
          node {
            id
            name
            ...ShowItem_show
          }
        }
      }
    }
  `,
})
