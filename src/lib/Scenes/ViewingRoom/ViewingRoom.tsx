import { Box, color, Flex, Sans, Serif, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { FlatList, TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import styled from "styled-components"
import { ViewingRoomArtworkRailContainer } from "./Components/ViewingRoomArtworkRail"
import { ViewingRoomHeaderContainer } from "./Components/ViewingRoomHeader"
import { ViewingRoomSubsectionsContainer } from "./Components/ViewingRoomSubsections"

interface ViewingRoomProps {
  viewingRoom: ViewingRoom_viewingRoom
}

interface ViewingRoomSection {
  key: string
  content: JSX.Element
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

// TODO: add tracking! For now this is just here because it crashes otherwise lol :/

export const ViewingRoom: React.FC<ViewingRoomProps> = props => {
  const viewingRoom = props.viewingRoom
  const sections: ViewingRoomSection[] = []
  const navRef = useRef()

  const pluralizedArtworksCount = viewingRoom.artworksForCount.totalCount === 1 ? "work" : "works"

  sections.push({
    key: "statement",
    content: (
      <View>
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
    ),
  })
  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: "artistAboveTheFold.slug",
        context_screen_owner_id: "artistAboveTheFold.internalID",
      }}
    >
      <Theme>
        <View style={{ flex: 1 }} ref={navRef}>
          <FlatList<ViewingRoomSection>
            data={sections}
            ListHeaderComponent={<ViewingRoomHeaderContainer viewingRoom={viewingRoom} />}
            contentInset={{ bottom: 80 }}
            renderItem={({ item }) => {
              return item.content
            }}
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
                  View {pluralizedArtworksCount} ({viewingRoom.artworksForCount.totalCount})
                </Sans>
              </ViewWorksButton>
            </TouchableWithoutFeedback>
          </ViewWorksButtonContainer>
        </View>
      </Theme>
    </ProvideScreenTracking>
  )
}

export const ViewingRoomFragmentContainer = createFragmentContainer(ViewingRoom, {
  viewingRoom: graphql`
    fragment ViewingRoom_viewingRoom on ViewingRoom {
      artworksForCount: artworksConnection(first: 1) {
        totalCount
      }
      body
      pullQuote
      introStatement
      ...ViewingRoomSubsections_viewingRoomSubsections
      ...ViewingRoomArtworkRail_viewingRoomArtworks
      ...ViewingRoomHeader_viewingRoom
      ...ViewingRoomArtworks_viewingRoom
    }
  `,
})

// We'll eventually have this take in { viewingRoomID } as props and delete the hardcoded ID
export const ViewingRoomRenderer: React.SFC<{ viewingRoomID: string }> = () => {
  return (
    <QueryRenderer<ViewingRoomQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ViewingRoomQuery($viewingRoomID: ID!) {
          viewingRoom(id: $viewingRoomID) {
            ...ViewingRoom_viewingRoom
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        viewingRoomID: "ef1f10be-5fc5-42d7-9ab4-9308dee5ed37",
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}
