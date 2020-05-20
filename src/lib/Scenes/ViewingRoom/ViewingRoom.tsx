import { Sans, Serif, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { once } from "lodash"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, View, ViewToken } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { ViewingRoomArtworkRailContainer } from "./Components/ViewingRoomArtworkRail"
import { ViewingRoomHeaderContainer } from "./Components/ViewingRoomHeader"
import { ViewingRoomSubsectionsContainer } from "./Components/ViewingRoomSubsections"
import { ViewingRoomViewWorksButtonContainer } from "./Components/ViewingRoomViewWorksButton"

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
  const tracking = useTracking()
  const trackBodyImpression = useCallback(
    once(() =>
      tracking.trackEvent({
        action_name: Schema.ActionNames.BodyImpression,
        ...tracks.context(viewingRoom.internalID, viewingRoom.slug),
      })
    ),
    []
  )
  const [displayViewWorksButton, setDisplayViewWorksButton] = useState(false)

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
      content: <ViewingRoomArtworkRailContainer viewingRoom={viewingRoom} />,
    },
    {
      key: "pullQuote",
      content: (
        <>
          {viewingRoom.pullQuote && (
            <Sans data-test-id="pull-quote" size="8" textAlign="center" mt="3" mx="2">
              {viewingRoom.pullQuote}
            </Sans>
          )}
        </>
      ),
    },
    {
      key: "body",
      content: (
        <Serif data-test-id="body" size="4" mt="3" mx="2">
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
    <ProvideScreenTracking info={tracks.context(viewingRoom.internalID, viewingRoom.slug)}>
      <Theme>
        <View style={{ flex: 1 }} ref={navRef as any /* STRICTNESS_MIGRATION */}>
          <FlatList<ViewingRoomSection>
            onViewableItemsChanged={useCallback(({ viewableItems }) => {
              if (viewableItems.find((viewableItem: ViewToken) => viewableItem.item.key === "body")) {
                trackBodyImpression()
                setDisplayViewWorksButton(true)
              }
            }, [])}
            viewabilityConfig={{ itemVisiblePercentThreshold: 15 }}
            data={sections}
            ListHeaderComponent={<ViewingRoomHeaderContainer viewingRoom={viewingRoom} />}
            contentInset={{ bottom: 80 }}
            renderItem={({ item }) => {
              return item.content
            }}
          />
          {displayViewWorksButton && <ViewingRoomViewWorksButtonContainer {...props} />}
        </View>
      </Theme>
    </ProvideScreenTracking>
  )
}

export const tracks = {
  context: (ownerId: string, slug: string) => {
    return {
      context_screen: Schema.PageNames.ViewingRoom,
      context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      context_screen_owner_id: ownerId,
      context_screen_owner_slug: slug,
    }
  },
}

export const ViewingRoomFragmentContainer = createFragmentContainer(ViewingRoom, {
  viewingRoom: graphql`
    fragment ViewingRoom_viewingRoom on ViewingRoom {
      body
      pullQuote
      introStatement
      slug
      internalID
      ...ViewingRoomViewWorksButton_viewingRoom
      ...ViewingRoomSubsections_viewingRoom
      ...ViewingRoomArtworkRail_viewingRoom
      ...ViewingRoomHeader_viewingRoom
      ...ViewingRoomArtworks_viewingRoom
    }
  `,
})

export const ViewingRoomRenderer: React.SFC<{ viewingRoomID: string }> = ({ viewingRoomID }) => {
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
        viewingRoomID,
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}
