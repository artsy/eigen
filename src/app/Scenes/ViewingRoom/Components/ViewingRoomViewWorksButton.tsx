import { Flex, Text } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { ViewingRoomViewWorksButton_viewingRoom$data } from "__generated__/ViewingRoomViewWorksButton_viewingRoom.graphql"
import { AnimatedBottomButton } from "app/Components/AnimatedBottomButton"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Schema } from "app/utils/track"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface ViewingRoomViewWorksButtonProps {
  viewingRoom: ViewingRoomViewWorksButton_viewingRoom$data
  isVisible: boolean
}

export const ViewingRoomViewWorksButton: React.FC<ViewingRoomViewWorksButtonProps> = (props) => {
  const { viewingRoom } = props
  const tracking = useTracking()
  const artworksCount = viewingRoom.artworksForCount?.totalCount

  if (artworksCount === 0) {
    return null
  }

  const pluralizedArtworksCount = artworksCount === 1 ? "work" : "works"

  const roundedButtonStyle = { borderRadius: 20 }

  return (
    <View>
      <RouterLink
        noFeedback
        hasChildTouchable
        to={`/viewing-room/${viewingRoom.slug}/artworks`}
        onPress={() => {
          tracking.trackEvent(
            tracks.tappedViewWorksButton(viewingRoom.internalID, viewingRoom.slug)
          )
        }}
      >
        <AnimatedBottomButton buttonStyles={roundedButtonStyle} isVisible={props.isVisible}>
          <ViewWorksButton testID="view-works" px={2}>
            <Text variant="sm" py={1} color="mono0" weight="medium">
              View {pluralizedArtworksCount} ({artworksCount})
            </Text>
          </ViewWorksButton>
        </AnimatedBottomButton>
      </RouterLink>
    </View>
  )
}

const ViewWorksButton = styled(Flex)`
  border-radius: 20px;
  background-color: ${themeGet("colors.mono100")};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`

export const tracks = {
  tappedViewWorksButton: (id: string, slug: string) => {
    return {
      action: Schema.ActionNames.TappedViewWorksButton,
      context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      destination_screen: Schema.PageNames.ViewingRoomArtworks,
      destination_screen_owner_id: id,
      destination_screen_owner_slug: slug,
    }
  },
}

export const ViewingRoomViewWorksButtonContainer = createFragmentContainer(
  ViewingRoomViewWorksButton,
  {
    viewingRoom: graphql`
      fragment ViewingRoomViewWorksButton_viewingRoom on ViewingRoom {
        slug
        internalID
        artworksForCount: artworksConnection(first: 1) {
          totalCount
        }
      }
    `,
  }
)
