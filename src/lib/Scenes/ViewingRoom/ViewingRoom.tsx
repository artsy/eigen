import { Button, Flex, Sans, Spacer, Text, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import LoadFailureView from "lib/Components/LoadFailureView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { once } from "lodash"
import { maxWidth } from "palette"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, LayoutAnimation, View, ViewToken } from "react-native"
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

// Same as Gravity model viewing_room_status
export enum ViewingRoomStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  LIVE = "live",
  CLOSED = "closed",
}

export const ClosedNotice: React.FC<{ status: string; navRef: React.RefObject<View>; partnerHref: string }> = ({
  status,
  navRef,
  partnerHref,
}) => {
  let finalText = ""
  if (status === ViewingRoomStatus.CLOSED) {
    finalText = "This viewing room is now closed. We invite you to view this gallery’s current works."
  } else if (status === ViewingRoomStatus.SCHEDULED) {
    finalText = "This viewing room is not yet open. We invite you to view this gallery’s current works."
  }

  return (
    <Flex alignItems="center">
      <Sans mt="3" size="3t" mx="4" textAlign="center">
        {finalText}
      </Sans>
      <Button
        variant="secondaryGray"
        onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, partnerHref)}
        mt={2}
      >
        Visit gallery
      </Button>
    </Flex>
  )
}

export const ViewingRoom: React.FC<ViewingRoomProps> = props => {
  const viewingRoom = props.viewingRoom
  const navRef = useRef<View>(null)
  const tracking = useTracking()
  const trackBodyImpression = useCallback(
    once(() => tracking.trackEvent(tracks.bodyImpression(viewingRoom.internalID, viewingRoom.slug))),
    []
  )
  const [displayViewWorksButton, setDisplayViewWorksButton] = useState(false)

  if (viewingRoom === null) {
    return <LoadFailureView style={{ flex: 1 }} />
  }

  const sections: ViewingRoomSection[] = []

  if (viewingRoom.status === ViewingRoomStatus.CLOSED || viewingRoom.status === ViewingRoomStatus.SCHEDULED) {
    sections.push({
      key: "closedNotice",
      content: <ClosedNotice status={viewingRoom.status} navRef={navRef} partnerHref={viewingRoom.partner!.href!} />,
    })
  } else if (viewingRoom.status === ViewingRoomStatus.LIVE) {
    sections.push(
      {
        key: "introStatement",
        content: (
          <Flex mt="2" mx="2">
            <Text data-test-id="intro-statement" mt="2" variant="text" mx="2" style={maxWidth}>
              {viewingRoom.introStatement}
            </Text>
          </Flex>
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
            {!!viewingRoom.pullQuote && (
              <Flex mx="2">
                <Text data-test-id="pull-quote" variant="largeTitle" textAlign="center">
                  {viewingRoom.pullQuote}
                </Text>
              </Flex>
            )}
          </>
        ),
      },
      {
        key: "body",
        content: (
          <Flex mx="2">
            <Text data-test-id="body" variant="text" style={maxWidth}>
              {viewingRoom.body}
            </Text>
          </Flex>
        ),
      },
      {
        key: "subsections",
        content: <ViewingRoomSubsectionsContainer viewingRoom={viewingRoom} />,
      }
    )
  }

  return (
    <ProvideScreenTracking info={tracks.context(viewingRoom.internalID, viewingRoom.slug)}>
      <Theme>
        <View style={{ flex: 1 }} ref={navRef}>
          <FlatList<ViewingRoomSection>
            onViewableItemsChanged={useCallback(({ viewableItems }) => {
              if (viewableItems.find((viewableItem: ViewToken) => viewableItem.item.key === "body")) {
                trackBodyImpression()
                LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 150 })
                setDisplayViewWorksButton(true)
              }
            }, [])}
            contentContainerStyle={{ paddingBottom: 80 }}
            viewabilityConfig={{ itemVisiblePercentThreshold: 15 }}
            data={sections}
            ListHeaderComponent={<ViewingRoomHeaderContainer viewingRoom={viewingRoom} />}
            ItemSeparatorComponent={() => <Spacer mb={3} />}
            renderItem={({ item }) => {
              return item.content
            }}
          />
          <ViewingRoomViewWorksButtonContainer isVisible={displayViewWorksButton} {...props} />
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
  bodyImpression: (id: string, slug: string) => ({
    action: Schema.ActionNames.BodyImpression,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
  }),
}

export const ViewingRoomFragmentContainer = createFragmentContainer(ViewingRoom, {
  viewingRoom: graphql`
    fragment ViewingRoom_viewingRoom on ViewingRoom {
      body
      pullQuote
      introStatement
      slug
      internalID
      status
      partner {
        href
      }
      ...ViewingRoomViewWorksButton_viewingRoom
      ...ViewingRoomSubsections_viewingRoom
      ...ViewingRoomArtworkRail_viewingRoom
      ...ViewingRoomHeader_viewingRoom
    }
  `,
})

export const ViewingRoomQueryRenderer: React.SFC<{ viewing_room_id: string }> = ({
  viewing_room_id: viewingRoomID,
}) => {
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
