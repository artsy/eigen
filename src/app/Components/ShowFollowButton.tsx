import { BoxProps, FollowButton } from "@artsy/palette-mobile"
import { ShowFollowButtonMutation } from "__generated__/ShowFollowButtonMutation.graphql"
import {
  ShowFollowButton_show$data,
  ShowFollowButton_show$key,
} from "__generated__/ShowFollowButton_show.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { FC, useState } from "react"
import { commitMutation, graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ShowFollowButtonProps extends BoxProps {
  show: ShowFollowButton_show$key
}

export const ShowFollowButton: FC<ShowFollowButtonProps> = ({ show: showProp, ...boxProps }) => {
  const isFollowShowsAndFairsEnabled = useFeatureFlag("AREnableFollowShowsAndFairs")
  const show = useFragment(showFragment, showProp)
  const [isFollowedSaving, setIsFollowedSaving] = useState(false)
  const { trackEvent } = useTracking()

  if (!isFollowShowsAndFairsEnabled) {
    return null
  }

  const handlePress = () => {
    const { id: nodeID, internalID: showID, isFollowed: isShowFollowed } = show

    if (showID && nodeID && !isFollowedSaving) {
      trackEvent(tracks.trackSave(show))

      setIsFollowedSaving(true)
      commitMutation<ShowFollowButtonMutation>(getRelayEnvironment(), {
        onCompleted: () => setIsFollowedSaving(false),
        onError: () => setIsFollowedSaving(false),
        mutation: graphql`
          mutation ShowFollowButtonMutation($input: FollowShowInput!) {
            followShow(input: $input) {
              show {
                id
                slug
                internalID
                isFollowed
              }
            }
          }
        `,
        variables: {
          input: {
            partnerShowID: showID,
            unfollow: isShowFollowed,
          },
        },
        // @ts-ignore RELAY 12 MIGRATION
        optimisticResponse: {
          followShow: {
            show: {
              id: nodeID,
              slug: show.slug,
              internalID: showID,
              isFollowed: !isShowFollowed,
            },
          },
        },
        updater: (store) => {
          const showRecord = store?.get(nodeID)
          if (showRecord) {
            showRecord.setValue(!isShowFollowed, "isFollowed")
          }
        },
      })
    }
  }

  return (
    <FollowButton
      isFollowed={!!show.isFollowed}
      onPress={handlePress}
      loading={isFollowedSaving}
      {...boxProps}
    />
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
    } as any
  },
}
