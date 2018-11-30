import { Box, Flex, Sans, Serif } from "@artsy/palette"
import { Shows_show } from "__generated__/Shows_show.graphql"
import React from "react"
import { FlatList, Image, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowItemContainer as ShowItem } from "./Components/ShowItem"

interface Props {
  show: Shows_show
  handleViewOnMap: () => void
}

export const Shows: React.SFC<Props> = ({ show }) => {
  const handleViewOnMap = () => {
    // TODO: Show view on map view when clicked
    console.log("clicked view on map")
  }

  const { edges } = show.nearbyShows
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" flexDirection="row">
        <Serif size="5">More Shows</Serif>
        <TouchableOpacity onPress={() => handleViewOnMap()}>
          <Flex alignItems="center" flexDirection="row">
            <Sans size="2">View on map</Sans>
            <Box ml={1} mr={1}>
              <Image style={{ width: 20, height: 22 }} source={require("../../../../../../images/map.png")} />
            </Box>
          </Flex>
        </TouchableOpacity>
      </Flex>
      <FlatList
        horizontal
        data={edges}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.node.__id}
        renderItem={({ item }) => {
          return <ShowItem show={item.node as any} />
        }}
      />
    </>
  )
}

export const ShowsContainer = createFragmentContainer(
  Shows,
  graphql`
    fragment Shows_show on Show {
      nearbyShows(first: 20) {
        edges {
          node {
            ...ShowItem_show
          }
        }
      }
    }
  `
)
