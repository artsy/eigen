import { Box, Sans, Serif } from "@artsy/palette"
import { ViewingRoomStatement_viewingRoom } from "__generated__/ViewingRoomStatement_viewingRoom.graphql"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ViewingRoomArtworkRailContainer } from "./ViewingRoomArtworkRail"
import { ViewingRoomSubsectionsContainer } from "./ViewingRoomSubsections"

interface ViewingRoomStatementProps {
  viewingRoom: ViewingRoomStatement_viewingRoom
}

export const ViewingRoomStatement: React.FC<ViewingRoomStatementProps> = props => {
  const viewingRoom = props.viewingRoom

  return (
    <View ref={navRef as any /* STRICTNESS_MIGRATION */}>
      <Serif data-test-id="intro-statement" size="4" mt="2" mx="2">
        {viewingRoom.introStatement}
      </Serif>
      <Box mx="2">
        <ViewingRoomArtworkRailContainer viewingRoomArtworks={viewingRoom} />
      </Box>
      <Sans data-test-id="pull-quote" size="8" textAlign="center" my="3" mx="2">
        {viewingRoom.pullQuote}
      </Sans>
      <Serif data-test-id="body" size="4" mx="2">
        {viewingRoom.body}
      </Serif>
      <ViewingRoomSubsectionsContainer viewingRoomSubsections={viewingRoom} />
    </View>
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
