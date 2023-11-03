import { useMutation, graphql } from "react-relay"

export interface FollowProfileOptions {
  id: string
  internalID: string
  isFollowd: boolean | null
  onCompleted?: (isFollowd: boolean) => void
  onError?: () => void
}

export const useFollowProfile = ({
  id,
  internalID,
  isFollowd,
  onCompleted,
  onError,
}: FollowProfileOptions) => {
  const [commit, isInFlight] = useMutation(Mutation)

  const nextFollowdState = !isFollowd

  const followProfile = () => {
    commit({
      variables: {
        input: {
          profileID: internalID,
          unfollow: !!isFollowd,
        },
      },
      onCompleted: () => {
        onCompleted?.(nextFollowdState)
      },
      onError,
      optimisticResponse: {
        followProfile: {
          profile: {
            id,
            internalID,
            isFollowed: nextFollowdState,
          },
        },
      },
      optimisticUpdater: (store) => {
        const profile = store.get(id)
        profile?.setValue(nextFollowdState, "isFollowd")
      },
    })
  }

  return { followProfile, isInFlight }
}

const Mutation = graphql`
  mutation useFollowProfileMutation($input: FollowProfileInput!) {
    followProfile(input: $input) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`
