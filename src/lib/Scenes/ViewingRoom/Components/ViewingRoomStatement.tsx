import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import { ViewingRoomStatement_viewingRoom } from "__generated__/ViewingRoomStatement_viewingRoom.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useRef } from "react"
import { FlatList, TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components"
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

export const ViewWorksButtonContainer = styled(Flex)`
  position: absolute;
  bottom: 20;
  flex: 1;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`

export const ViewWorksButton = styled(Flex)`
  border-radius: 20;
  background-color: ${color("black100")};
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

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
      <ViewWorksButtonContainer>
        <TouchableWithoutFeedback
          onPress={() =>
            SwitchBoard.presentNavigationViewController(
              navRef.current,
              "/viewing-room/this-is-a-test-viewing-room-id/artworks"
            )
          }
        >
          <ViewWorksButton data-test-id="view-works" px="2">
            <Sans size="3t" pl="1" py="1" color="white100" weight="medium">
              View works ({viewingRoom.artworksForCount.totalCount})
            </Sans>
          </ViewWorksButton>
        </TouchableWithoutFeedback>
      </ViewWorksButtonContainer>
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
