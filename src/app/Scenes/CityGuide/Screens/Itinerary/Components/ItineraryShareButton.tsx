import { ShareIcon } from "@artsy/icons/native"
import { Flex, Touchable } from "@artsy/palette-mobile"
import { ItineraryShareButton_itinerary$key } from "__generated__/ItineraryShareButton_itinerary.graphql"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { useItineraryShare } from "app/Scenes/CityGuide/hooks/useItineraryShare"
import { graphql, useFragment } from "react-relay"

const BUTTON_SIZE = 40

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

  // Curated guides aren't shareable. A personal itinerary is, but only when it's yours —
  // reached via someone else's share link, there's nothing here to give out.
  if (!itinerary || itinerary.isCurated || !itinerary.isMine) {
    return null
  }

  return (
    <Touchable
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
        <ShareIcon width={ACCESSIBLE_DEFAULT_ICON_SIZE} height={ACCESSIBLE_DEFAULT_ICON_SIZE} />
      </Flex>
    </Touchable>
  )
}

const fragment = graphql`
  fragment ItineraryShareButton_itinerary on Itinerary {
    internalID
    slug
    citySlug
    title
    isCurated
    isMine
    shareToken
  }
`
