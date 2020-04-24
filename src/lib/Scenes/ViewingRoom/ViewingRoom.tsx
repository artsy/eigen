import { Box, color, Flex, Sans, Serif, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, TouchableWithoutFeedback, View, ViewToken } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"
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

export const ViewingRoom: React.FC<ViewingRoomProps> = props => {
  const viewingRoom = props.viewingRoom
  const navRef = useRef()
  const [displayViewWorksButton, setDisplayViewWorksButton] = useState(false)

  const artworksCount = viewingRoom.artworksForCount?.totalCount
  const pluralizedArtworksCount = artworksCount === 1 ? "work" : "works"

  const sections: ViewingRoomSection[] = [
    {
      key: "introStatement",
      content: (
        <Serif data-test-id="intro-statement" size="4" mt="2" mx="2">
          {viewingRoom.introStatement}
        </Serif>
      ),
    },
    {
      key: "artworkRail",
      content: (
        <Box mx="2">
          <ViewingRoomArtworkRailContainer viewingRoomArtworks={viewingRoom} />
        </Box>
      ),
    },
    {
      key: "pullQuote",
      content: (
        <Sans data-test-id="pull-quote" size="8" textAlign="center" my="3" mx="2">
          {viewingRoom.pullQuote}
        </Sans>
      ),
    },
    {
      key: "body",
      content: (
        <Serif data-test-id="body" size="4" mx="2">
          {viewingRoom.body}
        </Serif>
      ),
    },
    {
      key: "subsections",
      content: <ViewingRoomSubsectionsContainer viewingRoom={viewingRoom} />,
    },
  ]

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
        <View style={{ flex: 1 }} ref={navRef as any /* STRICTNESS_MIGRATION */}>
          <FlatList<ViewingRoomSection>
            onViewableItemsChanged={useCallback(({ viewableItems }) => {
              if (viewableItems.find((viewableItem: ViewToken) => viewableItem.item.key === "pullQuote")) {
                setDisplayViewWorksButton(true)
              }
            }, [])}
            viewabilityConfig={{ itemVisiblePercentThreshold: 75 }}
            data={sections}
            ListHeaderComponent={<ViewingRoomHeaderContainer viewingRoom={viewingRoom} />}
            contentInset={{ bottom: 80 }}
            renderItem={({ item }) => {
              return item.content
            }}
          />
          {displayViewWorksButton && (
            <ViewWorksButtonContainer>
              <TouchableWithoutFeedback
                onPress={() =>
                  SwitchBoard.presentNavigationViewController(
                    navRef.current!,
                    "/viewing-room/this-is-a-test-viewing-room-id/artworks"
                  )
                }
              >
                <ViewWorksButton data-test-id="view-works" px="2">
                  <Sans size="3t" py="1" color="white100" weight="medium">
                    View {pluralizedArtworksCount} ({artworksCount})
                  </Sans>
                </ViewWorksButton>
              </TouchableWithoutFeedback>
            </ViewWorksButtonContainer>
          )}
        </View>
      </Theme>
    </ProvideScreenTracking>
  )
}

const ViewWorksButtonContainer = styled(Flex)`
  position: absolute;
  bottom: 20;
  flex: 1;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`

const ViewWorksButton = styled(Flex)`
  border-radius: 20;
  background-color: ${color("black100")};
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

export const ViewingRoomFragmentContainer = createFragmentContainer(ViewingRoom, {
  viewingRoom: graphql`
    fragment ViewingRoom_viewingRoom on ViewingRoom {
      artworksForCount: artworksConnection(first: 1) {
        totalCount
      }
      body
      pullQuote
      introStatement
      ...ViewingRoomSubsections_viewingRoom
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
        viewingRoomID: "1489f6b2-39f2-449d-9cc2-6baa5782c756",
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}
