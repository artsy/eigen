import { ActionType, ContextModule, OwnerType, TappedCreateAlert } from "@artsy/cohesion"
import { BellIcon, Flex, Box, Text, TouchableHighlightColor } from "@artsy/palette-mobile"
import { SavedSearchButtonV2Popover } from "app/Components/Artist/ArtistArtworks/SavedSearchButtonV2Popover"
import { useTracking } from "react-tracking"

export interface SavedSearchButtonV2Props {
  artistId: string
  artistSlug: string
  onPress: () => void
  shouldShowCreateAlertPrompt?: boolean
}

export const SavedSearchButtonV2: React.FC<SavedSearchButtonV2Props> = (props) => {
  const { artistId, artistSlug, onPress, shouldShowCreateAlertPrompt } = props
  const tracking = useTracking()

  const handlePress = () => {
    onPress()
    tracking.trackEvent(tracks.tappedCreateAlert(artistId, artistSlug))
  }

  return (
    <Flex>
      <SavedSearchButtonV2Popover shouldShowCreateAlertPrompt={shouldShowCreateAlertPrompt}>
        <TouchableHighlightColor
          haptic
          onPress={handlePress}
          render={({ color }) => (
            <Flex flexDirection="row" alignItems="center">
              <Box backgroundColor="white">
                <BellIcon fill={color} width="16px" height="16px" />
              </Box>
              <Text variant="xs" color={color} ml={0.5} numberOfLines={1} lineHeight="16px">
                Create Alert
              </Text>
            </Flex>
          )}
        />
      </SavedSearchButtonV2Popover>
    </Flex>
  )
}

export const tracks = {
  tappedCreateAlert: (artistId: string, artistSlug: string): TappedCreateAlert => ({
    action: ActionType.tappedCreateAlert,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    context_module: ContextModule.artworkGrid,
  }),
}
