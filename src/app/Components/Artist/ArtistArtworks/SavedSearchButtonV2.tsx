import { ContextModule, OwnerType } from "@artsy/cohesion"
import { BellStrokeIcon } from "@artsy/icons/native"
import { Flex, Box, Text, TouchableHighlightColor } from "@artsy/palette-mobile"
import { ProgressiveOnboardingSaveAlert } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveAlert"
import { useCreateAlertTracking } from "app/Scenes/SavedSearchAlert/useCreateAlertTracking"

export interface SavedSearchButtonV2Props {
  artistId: string
  artistSlug: string
  onPress: () => void
}

export const SavedSearchButtonV2: React.FC<SavedSearchButtonV2Props> = (props) => {
  const { artistId, artistSlug, onPress } = props

  const { trackCreateAlertTap } = useCreateAlertTracking({
    contextScreenOwnerType: OwnerType.artist,
    contextScreenOwnerId: artistId,
    contextScreenOwnerSlug: artistSlug,
    contextModule: ContextModule.artworkGrid,
  })

  const handlePress = () => {
    onPress()
    trackCreateAlertTap()
  }

  return (
    <Flex>
      <ProgressiveOnboardingSaveAlert>
        <TouchableHighlightColor
          haptic
          onPress={handlePress}
          render={({ color }) => (
            <Flex flexDirection="row" alignItems="center">
              <Box backgroundColor="mono0">
                <BellStrokeIcon fill={color} width="16px" height="16px" />
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
