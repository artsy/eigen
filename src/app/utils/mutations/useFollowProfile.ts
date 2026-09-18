import { useMutation, graphql } from "react-relay"
import { PayloadError, RecordSourceSelectorProxy } from "relay-runtime"

export interface FollowProfileOptions {
  id: string
  internalID: string
  isFollowed: boolean | null | undefined
  /** `errors` carries GraphQL errors returned with a successful response. */
  onCompleted?: (isFollowed: boolean, errors?: PayloadError[] | null) => void
  onError?: (error: Error) => void
}

export const followProfileMutationConfig = ({
  id,
  internalID,
  isFollowed,
}: FollowProfileOptions) => {
  const nextFollowedState = !isFollowed

  return {
    mutation: Mutation,
    variables: {
      input: {
        profileID: internalID,
        unfollow: !!isFollowed,
      },
    },
    optimisticResponse: {
      followProfile: {
        profile: {
          id,
          internalID,
          isFollowed: nextFollowedState,
        },
      },
    },
    optimisticUpdater: (store: RecordSourceSelectorProxy<{}>) => {
      const profile = store.get(id)
      profile?.setValue(nextFollowedState, "isFollowed")
    },
  }
}

export const useFollowProfile = ({
  id,
  internalID,
  isFollowed,
  onCompleted,
  onError,
}: FollowProfileOptions) => {
  const [commit, isInFlight] = useMutation(Mutation)

  const followProfile = () => {
    const config = followProfileMutationConfig({ id, internalID, isFollowed })

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

  return { followProfile, isInFlight }
}

const Mutation = graphql`
  mutation useFollowProfileMutation($input: FollowProfileInput!) @raw_response_type {
    followProfile(input: $input) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`
