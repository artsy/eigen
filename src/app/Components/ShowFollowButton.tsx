import { AddStrokeIcon, CheckmarkIcon } from "@artsy/icons/native"
import { BoxProps, Button, Flex } from "@artsy/palette-mobile"
import {
  ShowFollowButton_show$data,
  ShowFollowButton_show$key,
} from "__generated__/ShowFollowButton_show.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { FC } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

/** Matches the 24 the show header's designs specify for the glyph. */
const ICON_SIZE = 24
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

interface ShowFollowButtonProps extends BoxProps {
  show: ShowFollowButton_show$key
  /**
   * "button" is the labelled Save/Saved button. "icon" is the bare plus/tick the show
   * header's designs put on the title's row.
   *
   * The icon rendering is deliberately a few lines here rather than a shared component:
   * CityGuide has its own `CityGuideSaveButton` doing the same thing, but a Scene may not
   * import from another Scene (AGENTS.md). Worth extracting to `app/Components` if a third
   * caller appears.
   */
  variant?: "button" | "icon"
}

export const ShowFollowButton: FC<ShowFollowButtonProps> = ({
  show: showProp,
  variant = "button",
  ...boxProps
}) => {
  const isFollowShowsAndFairsEnabled = useFeatureFlag("AREnableFollowShowsAndFairs")
  const show = useFragment(showFragment, showProp)
  const { trackEvent } = useTracking()

  const { followShow, isInFlight } = useFollowShow({
    id: show.id,
    internalID: show.internalID,
    isFollowed: show.isFollowed,
    onCompleted: (_isFollowed, errors) => {
      if (errors?.length) {
        console.error("ShowFollowButton: followShow mutation returned errors", errors)
      }
    },
    onError: (error) => {
      console.error("ShowFollowButton: followShow mutation failed", error)
    },
  })

  if (!isFollowShowsAndFairsEnabled) {
    return null
  }

  const handlePress = () => {
    const { internalID: showID, id: nodeID } = show

    if (showID && nodeID && !isInFlight) {
      trackEvent(tracks.trackSave(show))
      followShow()
    }
  }

  if (variant === "icon") {
    return (
      <TouchableOpacity
        testID="show-follow-icon"
        accessibilityRole="button"
        accessibilityLabel={show.isFollowed ? "Saved" : "Save"}
        accessibilityState={{ selected: !!show.isFollowed, disabled: isInFlight }}
        disabled={isInFlight}
        hitSlop={HIT_SLOP}
        onPress={handlePress}
      >
        <Flex width={ICON_SIZE} height={ICON_SIZE} alignItems="center" justifyContent="center">
          {show.isFollowed ? (
            <CheckmarkIcon width={ICON_SIZE} height={ICON_SIZE} />
          ) : (
            <AddStrokeIcon width={ICON_SIZE} height={ICON_SIZE} />
          )}
        </Flex>
      </TouchableOpacity>
    )
  }

  return (
    <Button
      variant={show.isFollowed ? "outline" : "fillDark"}
      onPress={handlePress}
      loading={isInFlight}
      longestText="Saved"
      {...boxProps}
      size="small"
    >
      {show.isFollowed ? "Saved" : "Save"}
    </Button>
  )
}

const showFragment = graphql`
  fragment ShowFollowButton_show on Show {
    id
    internalID
    slug
    isFollowed
  }
`

const tracks = {
  trackSave: (show: ShowFollowButton_show$data) => {
    return {
      action_name: show.isFollowed ? Schema.ActionNames.UnsaveShow : Schema.ActionNames.SaveShow,
      action_type: Schema.ActionTypes.Success,
      owner_type: Schema.OwnerEntityTypes.Show,
      owner_id: show.internalID,
      owner_slug: show.slug,
    }
  },
}
