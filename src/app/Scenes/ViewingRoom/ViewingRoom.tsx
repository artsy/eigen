import { Button, Flex, ShareIcon, Spacer, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import { ViewingRoom_viewingRoom$data } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { RouterLink } from "app/system/navigation/RouterLink"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { once } from "lodash"
import React, { useCallback, useEffect, useState } from "react"
import { FlatList, LayoutAnimation, TouchableOpacity, View, ViewToken } from "react-native"
import RNShare from "react-native-share"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { ViewingRoomArtworkRailContainer } from "./Components/ViewingRoomArtworkRail"
import { ViewingRoomHeaderContainer } from "./Components/ViewingRoomHeader"
import { ViewingRoomSubsectionsContainer } from "./Components/ViewingRoomSubsections"
import { ViewingRoomViewWorksButtonContainer } from "./Components/ViewingRoomViewWorksButton"

interface ViewingRoomProps {
  viewingRoom: ViewingRoom_viewingRoom$data
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

export const ViewingRoom: React.FC<ViewingRoomProps> = (props) => {
  const viewingRoom = props.viewingRoom
  const [displayViewWorksButton, setDisplayViewWorksButton] = useState(false)
  const tracking = useTracking()

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Share Viewing Room"
            onPress={handleViewingRoomShare}
            testID="share-button"
          >
            <ShareIcon width={24} height={24} />
          </TouchableOpacity>
        )
      },
    })
  }, [navigation])
  const trackBodyImpression = useCallback(
    once(() =>
      tracking.trackEvent(tracks.bodyImpression(viewingRoom.internalID, viewingRoom.slug))
    ),
    []
  )
  const trackShare = () =>
    tracking.trackEvent(tracks.share(viewingRoom.internalID, viewingRoom.slug))
  async function handleViewingRoomShare() {
    trackShare()
    try {
      const url = getShareURL(`/viewing-room/${viewingRoom.slug}?utm_content=viewing-room-share`)
      const message = `${viewingRoom.title} by ${viewingRoom?.partner?.name} on Artsy`

      await RNShare.open({
        title: viewingRoom.title,
        message: message + "\n" + url,
        failOnCancel: false,
      })
    } catch (error) {
      console.error("ViewingRoom.tsx", error)
    }
  }

  const sections: ViewingRoomSection[] = []

  if (
    viewingRoom.status === ViewingRoomStatus.CLOSED ||
    viewingRoom.status === ViewingRoomStatus.SCHEDULED
  ) {
    sections.push({
      key: "closedNotice",
      content: (
        <ClosedNotice status={viewingRoom.status} partnerHref={viewingRoom?.partner?.href} />
      ),
    })
  } else if (viewingRoom.status === ViewingRoomStatus.LIVE) {
    sections.push({
      key: "introStatement",
      content: (
        <Flex mt={2} mx={2}>
          <Text testID="intro-statement" mt={2} variant="sm" mx={2} maxWidth>
            {viewingRoom.introStatement}
          </Text>
        </Flex>
      ),
    })
    if ((viewingRoom.artworks?.totalCount ?? 0) > 0) {
      sections.push({
        key: "artworkRail",
        content: <ViewingRoomArtworkRailContainer viewingRoom={viewingRoom} />,
      })
    }
    sections.push(
      {
        key: "pullQuote",
        content: (
          <>
            {!!viewingRoom.pullQuote && (
              <Flex mx={2}>
                <Text testID="pull-quote" variant="lg-display" textAlign="center">
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
          <Flex mx={2}>
            <Text testID="body" variant="sm" maxWidth>
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
      <View style={{ flex: 1, position: "relative" }}>
        <FlatList<ViewingRoomSection>
          onViewableItemsChanged={useCallback(({ viewableItems }) => {
            if (viewableItems.find((viewableItem: ViewToken) => viewableItem.item.key === "body")) {
              trackBodyImpression()
              LayoutAnimation.configureNext({
                ...LayoutAnimation.Presets.easeInEaseOut,
                duration: 150,
              })
              setDisplayViewWorksButton(true)
            }
          }, [])}
          contentContainerStyle={{ paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET }}
          viewabilityConfig={{ itemVisiblePercentThreshold: 15 }}
          data={sections}
          ListHeaderComponent={<ViewingRoomHeaderContainer viewingRoom={viewingRoom} />}
          ItemSeparatorComponent={() => <Spacer y={4} />}
          renderItem={({ item }) => {
            return item.content
          }}
        />
        <ViewingRoomViewWorksButtonContainer isVisible={displayViewWorksButton} {...props} />
      </View>
    </ProvideScreenTracking>
  )
}

export const ClosedNotice: React.FC<{ status: string; partnerHref?: string | null }> = ({
  status,
  partnerHref,
}) => {
  let finalText = ""
  if (status === ViewingRoomStatus.CLOSED) {
    finalText =
      "This viewing room is now closed. We invite you to view this gallery’s current works."
  } else if (status === ViewingRoomStatus.SCHEDULED) {
    finalText =
      "This viewing room is not yet open. We invite you to view this gallery’s current works."
  }

  return (
    <Flex alignItems="center">
      <Text variant="sm" mt={4} mx={4} textAlign="center">
        {finalText}
      </Text>
      {!!partnerHref && (
        <RouterLink to={partnerHref} hasChildTouchable>
          <Button variant="fillGray" mt={2}>
            Visit gallery
          </Button>
        </RouterLink>
      )}
    </Flex>
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
  share: (id: string, slug: string) => ({
    action: Schema.ActionNames.Share,
    action_type: Schema.ActionTypes.Tap,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
  }),
}

export const ViewingRoomFragmentContainer = createFragmentContainer(ViewingRoom, {
  viewingRoom: graphql`
    fragment ViewingRoom_viewingRoom on ViewingRoom {
      body
      introStatement
      internalID
      partner {
        href
        name
      }
      pullQuote
      slug
      status
      title
      artworks: artworksConnection(first: 10) {
        totalCount
      }
      ...ViewingRoomViewWorksButton_viewingRoom
      ...ViewingRoomSubsections_viewingRoom
      ...ViewingRoomArtworkRail_viewingRoom
      ...ViewingRoomHeader_viewingRoom
    }
  `,
})

export const ViewingRoomScreenQuery = graphql`
  query ViewingRoomQuery($viewingRoomID: ID!) @cacheable {
    viewingRoom(id: $viewingRoomID) @principalField {
      ...ViewingRoom_viewingRoom
    }
  }
`

export const ViewingRoomQueryRenderer: React.FC<{ viewingRoomID: string }> = ({
  viewingRoomID,
}) => {
  return (
    <QueryRenderer<ViewingRoomQuery>
      environment={getRelayEnvironment()}
      query={ViewingRoomScreenQuery}
      variables={{
        viewingRoomID,
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}
