import { setShowFollowed } from "app/utils/mutations/setShowFollowed"
import { graphql, useMutation } from "react-relay"

export interface FollowShowOptions {
  /** Relay node id, used for the optimistic store update. */
  id: string
  /** The show's internalID, sent to the mutation as partnerShowID. */
  internalID: string
  isFollowed: boolean | null | undefined
  onCompleted?: (isFollowed: boolean) => void
  onError?: () => void
}

export const useFollowShow = ({
  id,
  internalID,
  isFollowed,
  onCompleted,
  onError,
}: FollowShowOptions) => {
  const [commit, isInFlight] = useMutation(Mutation)

  const nextFollowedState = !isFollowed

  const followShow = () => {
    commit({
      variables: {
        input: {
          partnerShowID: internalID,
          unfollow: !!isFollowed,
        },
      },
      onCompleted: () => {
        onCompleted?.(nextFollowedState)
      },
      onError,
      optimisticResponse: {
        followShow: {
          show: {
            id,
            internalID,
            isFollowed: nextFollowedState,
          },
        },
      },
      optimisticUpdater: (store) => {
        setShowFollowed(store, id, nextFollowedState)
      },
    })
  }

  return { followShow, isInFlight }
}

const Mutation = graphql`
  mutation useFollowShowMutation($input: FollowShowInput!) {
    followShow(input: $input) {
      show {
        id
        internalID
        isFollowed
      }
    }
  }
`
