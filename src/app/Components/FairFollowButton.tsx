import { FollowButton } from "@artsy/palette-mobile"
import { FairFollowButton_fair$key } from "__generated__/FairFollowButton_fair.graphql"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useFollowProfile } from "app/utils/mutations/useFollowProfile"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface FairFollowButtonProps {
  fair: FairFollowButton_fair$key
}

export const FairFollowButton: FC<FairFollowButtonProps> = ({ fair }) => {
  const enableFollowShowsAndFairs = useFeatureFlag("AREnableFollowShowsAndFairs")
  const data = useFragment(fragment, fair)
  const { followProfile, isInFlight } = useFollowProfile({
    id: data?.profile?.id ?? "",
    internalID: data?.profile?.internalID ?? "",
    isFollowed: !!data?.profile?.isFollowed,
  })

  if (!enableFollowShowsAndFairs || !data?.profile) {
    return null
  }

  return (
    <FollowButton
      isFollowed={!!data.profile.isFollowed}
      onPress={followProfile}
      loading={isInFlight}
    />
  )
}

const fragment = graphql`
  fragment FairFollowButton_fair on Fair {
    internalID
    profile {
      id
      internalID
      isFollowed
    }
  }
`
