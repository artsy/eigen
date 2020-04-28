import { Box, Button, Flex, Sans, Serif } from "@artsy/palette"
import { ViewingRoomStatement_viewingRoom } from "__generated__/ViewingRoomStatement_viewingRoom.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ViewingRoomArtworkRailContainer } from "./ViewingRoomArtworkRail"
import { ViewingRoomSubsectionsContainer } from "./ViewingRoomSubsections"

interface ViewingRoomStatementProps {
  viewingRoom: ViewingRoomStatement_viewingRoom
}

interface ViewingRoomPageSection {
  key: string
  element: JSX.Element
  excludePadding?: boolean
}

export const ViewingRoomStatement: React.FC<ViewingRoomStatementProps> = props => {
  const navRef = useRef()

  const viewingRoom = props.viewingRoom
  const sections: ViewingRoomPageSection[] = []
  sections.push({
    key: "introStatement",
    element: (
      <Serif data-test-id="intro-statement" size="4" mt="2">
        {viewingRoom.introStatement}
      </Serif>
    ),
  })

  sections.push({
    key: "artworkRail",
    element: <ViewingRoomArtworkRailContainer viewingRoomArtworks={viewingRoom} />,
    excludePadding: true,
  })

  sections.push({
    key: "pullQuote",
    element: (
      <Sans data-test-id="pull-quote" size="8" textAlign="center" my="3">
        {viewingRoom.pullQuote}
      </Sans>
    ),
  })

  sections.push({
    key: "body",
    element: (
      <Serif data-test-id="body" size="4" mb="3">
        {viewingRoom.body}
      </Serif>
    ),
  })

  sections.push({
    key: "subsections",
    element: <ViewingRoomSubsectionsContainer viewingRoomSubsections={viewingRoom} />,
    excludePadding: false,
  })

  sections.push({
    key: "viewWorksButton",
    element: (
      <Flex width="100%" mt="2">
        <Button
          data-test-id="view-works"
          block
          onPress={() =>
            SwitchBoard.presentNavigationViewController(
              navRef.current!,
              "/viewing-room/this-is-a-test-viewing-room-id/artworks"
            )
          }
        >
          View works ({viewingRoom.artworksForCount! /* STRICTNESS_MIGRATION */.totalCount})
        </Button>
      </Flex>
    ),
  })

  return (
    <View ref={navRef as any /* STRICTNESS_MIGRATION */}>
      <FlatList<ViewingRoomPageSection>
        data={sections}
        ItemSeparatorComponent={() => <Box px={2} />}
        contentInset={{ bottom: 40 }}
        renderItem={({ item }) =>
          item.key === "subsections" ? <Box>{item.element}</Box> : <Box mx="2">{item.element}</Box>
        }
      />
    </View>
  )
}

export const ViewingRoomStatementContainer = createFragmentContainer(ViewingRoomStatement, {
  viewingRoom: graphql`
    fragment ViewingRoomStatement_viewingRoom on ViewingRoom {
      body
      pullQuote
      introStatement
      artworksForCount: artworksConnection(first: 1) {
        totalCount
      }
      ...ViewingRoomSubsections_viewingRoomSubsections
      ...ViewingRoomArtworkRail_viewingRoomArtworks
    }
  `,
})
