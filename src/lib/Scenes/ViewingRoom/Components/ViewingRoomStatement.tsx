import { Box, Button, Flex, Sans, Serif } from "@artsy/palette"
import { ViewingRoomStatement_viewingRoom } from "__generated__/ViewingRoomStatement_viewingRoom.graphql"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
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
    element: <Serif size="3t">{viewingRoom.introStatement}</Serif>,
  })

  sections.push({
    key: "artworkRail",
    element: <ViewingRoomArtworkRailContainer viewingRoomArtworks={viewingRoom} />,
    excludePadding: true,
  })

  sections.push({
    key: "pullQuote",
    element: (
      <Sans size="8" textAlign="center">
        {viewingRoom.pullQuote}
      </Sans>
    ),
  })

  sections.push({
    key: "body",
    element: <Serif size="4">{viewingRoom.body}</Serif>,
  })

  sections.push({
    key: "subsections",
    element: <ViewingRoomSubsectionsContainer viewingRoomSubsections={viewingRoom} />,
    excludePadding: false,
  })

  sections.push({
    key: "viewWorksButton",
    element: (
      <Flex width="100%">
        <Button
          block
          onPress={() =>
            SwitchBoard.presentNavigationViewController(
              navRef.current,
              "/viewing-room/this-is-a-test-viewing-room-id/artworks"
            )
          }
        >
          View works
        </Button>
      </Flex>
    ),
  })

  return (
    <StickyTabPageScrollView>
      <View ref={navRef}>
        <FlatList<ViewingRoomPageSection>
          data={sections}
          ItemSeparatorComponent={() => <Box px={2} my={2} />}
          contentInset={{ bottom: 40 }}
          renderItem={({ item }) => <Box>{item.element}</Box>}
        />
      </View>
    </StickyTabPageScrollView>
  )
}

export const ViewingRoomStatementContainer = createFragmentContainer(ViewingRoomStatement, {
  viewingRoom: graphql`
    fragment ViewingRoomStatement_viewingRoom on ViewingRoom {
      body
      pullQuote
      introStatement
      ...ViewingRoomSubsections_viewingRoomSubsections
      ...ViewingRoomArtworkRail_viewingRoomArtworks
    }
  `,
})
