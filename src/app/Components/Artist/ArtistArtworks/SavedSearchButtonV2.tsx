import {
  ActionType,
  ContextModule,
  OwnerType,
  ScreenOwnerType,
  TappedCreateAlert,
} from "@artsy/cohesion"
import { BellIcon, Flex, Box, Text, TouchableHighlightColor } from "@artsy/palette-mobile"
import { ProgressiveOnboardingSaveAlert } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveAlert"
import { useTracking } from "react-tracking"

export interface SavedSearchButtonV2Props {
  artistId: string
  artistSlug: string
  contextModule?: ContextModule
  onPress: () => void
}

export const SavedSearchButtonV2: React.FC<SavedSearchButtonV2Props> = (props) => {
  const { artistId, artistSlug, contextModule, onPress } = props
  const tracking = useTracking()

  const handlePress = () => {
    onPress()
    tracking.trackEvent(
      trackTappedCreateAlert.tappedCreateAlert(
        OwnerType.artist,
        artistId,
        artistSlug,
        contextModule
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

export const trackTappedCreateAlert = {
  tappedCreateAlert: (
    ownerType: ScreenOwnerType,
    ownerId?: string,
    ownerSlug?: string,
    contextModule?: ContextModule
  ): TappedCreateAlert => ({
    action: ActionType.tappedCreateAlert,
    context_screen_owner_type: ownerType,
    context_screen_owner_id: ownerId,
    context_screen_owner_slug: ownerSlug,
    context_module: contextModule,
  }),
}
