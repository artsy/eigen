import { useMutation, graphql } from "react-relay"

export interface FollowProfileOptions {
  id: string
  internalID: string
  isFollowed: boolean | null
  onCompleted?: (isFollowed: boolean) => void
  onError?: () => void
}

export const useFollowProfile = ({
  id,
  internalID,
  isFollowed,
  onCompleted,
  onError,
}: FollowProfileOptions) => {
  const [commit, isInFlight] = useMutation(Mutation)

  const nextFollowedState = !isFollowed

  const followProfile = () => {
    commit({
      variables: {
        input: {
          profileID: internalID,
          unfollow: !!isFollowed,
        },
      },
      onCompleted: () => {
        onCompleted?.(nextFollowedState)
      },
      onError,
      optimisticResponse: {
        followProfile: {
          profile: {
            id,
            internalID,
            isFollowed: nextFollowedState,
          },
        },
      },
      optimisticUpdater: (store) => {
        const profile = store.get(id)
        profile?.setValue(nextFollowedState, "isFollowed")
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
