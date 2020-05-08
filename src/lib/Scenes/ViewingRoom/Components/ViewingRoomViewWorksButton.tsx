import { color, Flex, Sans } from "@artsy/palette"
import { ViewingRoomViewWorksButton_viewingRoom } from "__generated__/ViewingRoomViewWorksButton_viewingRoom.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface ViewingRoomViewWorksButtonProps {
  viewingRoom: ViewingRoomViewWorksButton_viewingRoom
}

export const ViewingRoomViewWorksButton: React.FC<ViewingRoomViewWorksButtonProps> = props => {
  const { viewingRoom } = props
  const tracking = useTracking()
  const navRef = useRef()
  const artworksCount = viewingRoom.artworksForCount?.totalCount
  const pluralizedArtworksCount = artworksCount === 1 ? "work" : "works"

  return (
    <ViewWorksButtonContainer ref={navRef as any /* STRICTNESS_MIGRATION */}>
      <TouchableWithoutFeedback
        onPress={() => {
          tracking.trackEvent(tracks.tappedViewWorksButton(viewingRoom.internalID, viewingRoom.slug))
          SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${viewingRoom.slug}/artworks`)
        }}
      >
        <ViewWorksButton data-test-id="view-works" px="2">
          <Sans size="3t" py="1" color="white100" weight="medium">
            View {pluralizedArtworksCount} ({artworksCount})
          </Sans>
        </ViewWorksButton>
      </TouchableWithoutFeedback>
    </ViewWorksButtonContainer>
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

const tracks = {
  tappedViewWorksButton: (ownerID: string, slug: string) => {
    return {
      action_name: Schema.ActionNames.TappedViewWorksButton,
      destination_screen: Schema.PageNames.ViewingRoomArtworks,
      destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      destination_screen_owner_id: ownerID,
      destination_screen_owner_slug: slug,
    }
  },
}

export const ViewingRoomViewWorksButtonContainer = createFragmentContainer(ViewingRoomViewWorksButton, {
  viewingRoom: graphql`
    fragment ViewingRoomViewWorksButton_viewingRoom on ViewingRoom {
      slug
      internalID
      artworksForCount: artworksConnection(first: 1) {
        totalCount
      }
    }
  `,
})
