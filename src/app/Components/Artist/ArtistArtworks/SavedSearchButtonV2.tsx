import { ActionType, ContextModule, OwnerType, TappedCreateAlert } from "@artsy/cohesion"
import { BellIcon, Flex, Box, Text, TouchableHighlightColor } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { DAYS } from "app/Components/Artist/ArtistArtworks/hooks/useShouldShowReminder"
import { ProgressiveOnboardingSaveAlert } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveAlert"
import { GlobalStore } from "app/store/GlobalStore"
import { useTracking } from "react-tracking"

export interface SavedSearchButtonV2Props {
  artistId: string
  artistSlug: string
  onPress: () => void
}

export const SavedSearchButtonV2: React.FC<SavedSearchButtonV2Props> = (props) => {
  const { artistId, artistSlug, onPress } = props
  const { reminderState } = GlobalStore.useAppState((state) => state.createAlertReminder)
  const { dontShowCreateAlertReminderAgain } = GlobalStore.actions.createAlertReminder
  const tracking = useTracking()
  const isFocused = useIsFocused()

  const handlePress = () => {
    onPress()

    /**
     * if Create Alert CTA was pressed withing 2 minutes after the reminder was shown
     *  do not show the reminder again
     * */
    if (Date.now() - reminderState.dismissDate < 2 * DAYS && isFocused) {
      dontShowCreateAlertReminderAgain()
    }

    tracking.trackEvent(tracks.tappedCreateAlert(artistId, artistSlug))
  }

  return (
    <Flex>
      <ProgressiveOnboardingSaveAlert>
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
      </ProgressiveOnboardingSaveAlert>
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
