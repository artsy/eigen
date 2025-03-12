import { ContextModule, OwnerType } from "@artsy/cohesion"
import { BellIcon, Flex, Box, Text, TouchableHighlightColor } from "@artsy/palette-mobile"
import { trackTappedCreateAlert } from "app/Components/Artist/ArtistArtworks/CreateSavedSearchModal"
import { ProgressiveOnboardingSaveAlert } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveAlert"
import { useTracking } from "react-tracking"

export interface SavedSearchButtonV2Props {
  artistId: string
  artistSlug: string
  onPress: () => void
}

export const SavedSearchButtonV2: React.FC<SavedSearchButtonV2Props> = (props) => {
  const { artistId, artistSlug, onPress } = props
  const tracking = useTracking()

  const handlePress = () => {
    onPress()
    tracking.trackEvent(
      trackTappedCreateAlert.tappedCreateAlert(
        OwnerType.artist,
        artistId,
        artistSlug,
        ContextModule.artworkGrid
      )
    )
  }

  return (
    <Flex>
      <ProgressiveOnboardingSaveAlert>
        <TouchableHighlightColor
          haptic
          onPress={handlePress}
          render={({ color }) => (
            <Flex flexDirection="row" alignItems="center">
              <Box backgroundColor="white100">
                <BellIcon fill={color} width="16px" height="16px" />
              </Box>
              <Text variant="xs" color={color} ml={0.5} numberOfLines={1} lineHeight="16px">
                Create Alert
              </Text>
            </Flex>
          )}
        />
      </ProgressiveOnboardingSaveAlert>
    </Flex>
  )
}
