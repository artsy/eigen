import { useFollowArtist_artist$key } from "__generated__/useFollowArtist_artist.graphql"
import { Schema } from "app/utils/track"
import { useState } from "react"
import { useFragment, graphql, useMutation } from "react-relay"
import { useTracking } from "react-tracking"

export const useFollowArtist = (artist: useFollowArtist_artist$key) => {
  const [isLoading, setIsLoading] = useState(false)
  const data = useFragment(fragment, artist)
  const [commitMutation] = useMutation(mutation)
  const { trackEvent } = useTracking()

  const handleFollowToggle = () => {
    if (isLoading || !data) {
      return
    }

    trackEvent({
      action_name: data.isFollowed
        ? Schema.ActionNames.ArtistUnfollow
        : Schema.ActionNames.ArtistFollow,
      action_type: Schema.ActionTypes.Tap,
      owner_id: data.internalID,
      owner_slug: data.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })

    setIsLoading(true)

    commitMutation({
      variables: {
        input: {
          artistID: data.slug,
          unfollow: data.isFollowed,
        },
      },
      optimisticResponse: {
        followArtist: {
          artist: {
            ...data,
            isFollowed: !data.isFollowed,
          },
        },
      },
      onCompleted: successfulFollowChange,
      onError: failedFollowChange,
    })
  }

  const successfulFollowChange = () => {
    trackEvent({
      action_name: data.isFollowed
        ? Schema.ActionNames.ArtistUnfollow
        : Schema.ActionNames.ArtistFollow,
      action_type: Schema.ActionTypes.Success,
      owner_id: data.internalID,
      owner_slug: data.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })

    setIsLoading(false)
  }

  const failedFollowChange = () => {
    trackEvent({
      action_name: data.isFollowed
        ? Schema.ActionNames.ArtistFollow
        : Schema.ActionNames.ArtistUnfollow,
      action_type: Schema.ActionTypes.Fail,
      owner_id: data.internalID,
      owner_slug: data.slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })
    // callback for analytics purposes
    setIsLoading(false)
  }

  return { handleFollowToggle }
}

const fragment = graphql`
  fragment useFollowArtist_artist on Artist {
    id
    internalID
    slug
    isFollowed
  }
`

const mutation = graphql`
  mutation useFollowArtist_artist_Mutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        ...useFollowArtist_artist
      }
    }
  }
`
