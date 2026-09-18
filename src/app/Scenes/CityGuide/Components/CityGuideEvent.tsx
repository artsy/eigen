import { Box, Button, Flex, Text, useColor } from "@artsy/palette-mobile"
import { CityGuideEventArtworkRailQueryRenderer } from "app/Scenes/CityGuide/Components/CityGuideEventArtworkRail"
import { Show } from "app/Scenes/CityGuide/utils/types"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { exhibitionDates } from "app/utils/exhibitionPeriodParser"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { TouchableWithoutFeedback } from "react-native"
import { useTracking } from "react-tracking"

const TEXT_CONTAINER_WIDTH = 200

interface Props {
  event: Show
}

export const CityGuideEvent: React.FC<Props> = ({ event }) => {
  const { name, exhibition_period, partner, is_followed, end_at } = event
  const partnerName = partner?.name
  const color = useColor()
  const { trackEvent } = useTracking()

  const { followShow, isInFlight } = useFollowShow({
    id: event.id,
    internalID: event.internalID,
    isFollowed: is_followed,
  })

  const handleTap = () => {
    navigate(`/show/${event.slug}`)
  }

  const handleSaveChange = () => {
    if (!event.internalID || !event.slug || !event.id || isInFlight) {
      return
    }

    trackEvent(tracks.trackSave(event))
    followShow()
  }

  return (
    <TouchableWithoutFeedback accessibilityRole="button" onPress={handleTap}>
      <Box mb={2}>
        <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
          <Box width={TEXT_CONTAINER_WIDTH} mb={2}>
            <Text variant="sm" weight="medium" numberOfLines={1} ellipsizeMode="tail">
              {partnerName}
            </Text>
            <Text variant="sm" numberOfLines={1} ellipsizeMode="tail">
              {name}
            </Text>
            {!!exhibition_period && !!end_at && (
              <Text variant="xs" color={color("mono60")}>
                {exhibitionDates(exhibition_period, end_at)}
              </Text>
            )}
          </Box>
          <Button
            variant={is_followed ? "outline" : "fillDark"}
            loading={isInFlight}
            onPress={handleSaveChange}
            longestText="Saved"
            size="small"
          >
            {is_followed ? "Saved" : "Save"}
          </Button>
        </Flex>

        <Box mb={2} mx={-2}>
          <CityGuideEventArtworkRailQueryRenderer showID={event.internalID} />
        </Box>

        <Button variant="fillGray" onPress={handleTap} block size="small">
          Read More
        </Button>
      </Box>
    </TouchableWithoutFeedback>
  )
}

const tracks = {
  trackSave: (event: Show) => {
    const { slug, internalID, is_followed } = event
    const actionName = is_followed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow

    return {
      action_name: actionName,
      action_type: Schema.ActionTypes.Success,
      owner_type: Schema.OwnerEntityTypes.Show,
      owner_id: internalID,
      owner_slug: slug,
    }
  },
}
