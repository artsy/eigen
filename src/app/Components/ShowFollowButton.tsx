import { BoxProps, Button } from "@artsy/palette-mobile"
import {
  ShowFollowButton_show$data,
  ShowFollowButton_show$key,
} from "__generated__/ShowFollowButton_show.graphql"
import { FollowIconButton } from "app/Components/FollowIconButton"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useFollowShow } from "app/utils/mutations/useFollowShow"
import { Schema } from "app/utils/track"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ShowFollowButtonProps extends BoxProps {
  show: ShowFollowButton_show$key
  /**
   * "button" is the labelled Save/Saved button. "icon" is the bare plus/tick the show
   * header and the Saves tab's designs use, drawn by the shared `FollowIconButton`.
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
      <FollowIconButton
        testID="show-follow-icon"
        isFollowed={!!show.isFollowed}
        isInFlight={isInFlight}
        onPress={handlePress}
      />
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
