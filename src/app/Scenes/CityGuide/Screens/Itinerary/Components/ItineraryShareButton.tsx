import { ShareIcon } from "@artsy/icons/native"
import { Flex } from "@artsy/palette-mobile"
import { ItineraryShareButton_itinerary$key } from "__generated__/ItineraryShareButton_itinerary.graphql"
import { useItineraryShare } from "app/Scenes/CityGuide/hooks/useItineraryShare"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"

const BUTTON_SIZE = 40
const ICON_SIZE = 20

// The Edit button sits directly to the left of this one with only a small gap between them
// (FIREWORKS-48). The default hitSlop extends 20pt on every side, which reaches past that gap
// and steals taps meant for Edit, so the left side is left untouched here.
const SHARE_HIT_SLOP = { top: 20, bottom: 20, left: 0, right: 20 }

interface Props {
  itinerary: ItineraryShareButton_itinerary$key | null | undefined
}

/**
 * Floats over the hero image beside the back button, so it gets the same circular
 * background treatment as `BackButtonWithBackground` rather than palette's plain icon button.
 */
export const ItineraryShareButton: React.FC<Props> = ({ itinerary: itineraryRef }) => {
  const itinerary = useFragment(fragment, itineraryRef ?? null)
  const { share, isSharing } = useItineraryShare(
    itinerary ?? { internalID: "", citySlug: "", title: "", isCurated: false }
  )

  if (!itinerary) {
    return null
  }

  return (
    <TouchableOpacity
      testID="itinerary-share"
      accessibilityRole="button"
      accessibilityLabel={`Share ${itinerary.title}`}
      hitSlop={SHARE_HIT_SLOP}
      disabled={isSharing}
      onPress={share}
    >
      <Flex
        backgroundColor="background"
        width={BUTTON_SIZE}
        height={BUTTON_SIZE}
        borderRadius={BUTTON_SIZE / 2}
        alignItems="center"
        justifyContent="center"
      >
        <ShareIcon width={ICON_SIZE} height={ICON_SIZE} />
      </Flex>
    </TouchableOpacity>
  )
}

const fragment = graphql`
  fragment ItineraryShareButton_itinerary on Itinerary {
    internalID
    slug
    citySlug
    title
    isCurated
    shareToken
  }
`
