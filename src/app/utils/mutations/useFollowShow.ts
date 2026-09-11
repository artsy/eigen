import { setShowFollowed } from "app/utils/mutations/setShowFollowed"
import { graphql, useMutation } from "react-relay"
import { PayloadError, RecordSourceSelectorProxy } from "relay-runtime"

export interface FollowShowOptions {
  /** Relay node id, used for the optimistic store update. */
  id: string
  /** The show's internalID, sent to the mutation as partnerShowID. */
  internalID: string
  isFollowed: boolean | null | undefined
  /** `errors` carries GraphQL errors returned with a successful response. */
  onCompleted?: (isFollowed: boolean, errors?: PayloadError[] | null) => void
  onError?: (error: Error) => void
}

export const followShowMutationConfig = ({ id, internalID, isFollowed }: FollowShowOptions) => {
  const nextFollowedState = !isFollowed

  return {
    mutation: Mutation,
    variables: {
      input: {
        partnerShowID: internalID,
        unfollow: !!isFollowed,
      },
    },
    optimisticResponse: {
      followShow: {
        show: {
          id,
          internalID,
          isFollowed: nextFollowedState,
        },
      },
    },
    optimisticUpdater: (store: RecordSourceSelectorProxy<{}>) => {
      setShowFollowed(store, id, nextFollowedState)
    },
  }
}

export const useFollowShow = ({
  id,
  internalID,
  isFollowed,
  onCompleted,
  onError,
}: FollowShowOptions) => {
  const [commit, isInFlight] = useMutation(Mutation)

  const followShow = () => {
    const config = followShowMutationConfig({ id, internalID, isFollowed })

    commit({
      variables: config.variables,
      optimisticResponse: config.optimisticResponse,
      optimisticUpdater: config.optimisticUpdater,
      onCompleted: (_response, errors) => {
        onCompleted?.(!isFollowed, errors)
      },
      onError,
    })
  }

  return { followShow, isInFlight }
}

const Mutation = graphql`
  mutation useFollowShowMutation($input: FollowShowInput!) @raw_response_type {
    followShow(input: $input) {
      show {
        id
        internalID
        isFollowed
      }
    }
  }
`
