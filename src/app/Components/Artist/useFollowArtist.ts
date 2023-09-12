import { useFollowArtist_artist$key } from "__generated__/useFollowArtist_artist.graphql"
import { useFollowArtist_artist_Mutation } from "__generated__/useFollowArtist_artist_Mutation.graphql"
import { Schema } from "app/utils/track"
import { useState } from "react"
import { useFragment, graphql, useMutation } from "react-relay"
import { useTracking } from "react-tracking"

export const useFollowArtist = (artist: useFollowArtist_artist$key) => {
  const [isLoading, setIsLoading] = useState(false)
  const data = useFragment(fragment, artist)
  const [commitMutation] = useMutation<useFollowArtist_artist_Mutation>(mutation)
  const { trackEvent } = useTracking()

  const artistCount = data?.counts?.follows ?? 0

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
            counts: {
              follows: !data.isFollowed // Is followed now
                ? artistCount + 1
                : artistCount - 1,
            },
          },
        },
      },
      updater: (store, data) => {
        if (!data.followArtist?.artist) {
          return
        }

        const artist = data.followArtist.artist
        const artistProxy = store.get(artist.id)
        if (!artistProxy) {
          return
        }

        const artistCountsProxy = artistProxy.getLinkedRecord("counts")
        if (!artistCountsProxy) {
          return
        }

        artistCountsProxy.setValue(
          artist.isFollowed // Is followed now
            ? artistCount + 1
            : artistCount - 1,
          "follows"
        )
      },
      onCompleted: onFollowChangeSuccess,
      onError: onFollowChangeError,
    })
  }

  const onFollowChangeSuccess = () => {
    if (!data) {
      return
    }
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

  const onFollowChangeError = () => {
    if (!data) {
      return
    }
    trackEvent({
      action_name: data?.isFollowed
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
    id @required(action: NONE)
    internalID @required(action: NONE)
    slug @required(action: NONE)
    isFollowed
    counts @required(action: NONE) {
      follows
    }
  }
`

const mutation = graphql`
  mutation useFollowArtist_artist_Mutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        isFollowed
        ...useFollowArtist_artist
        ...ArtistHeaderNavRight_artist
      }
    }
  }
`
