import {
  ContextModule,
  FollowedArgs,
  followedArtist,
  OwnerType,
  unfollowedArtist,
} from "@artsy/cohesion"
import { Spacer, Text, EntityHeader } from "@artsy/palette-mobile"
import { ArtistSeriesMetaFollowMutation } from "__generated__/ArtistSeriesMetaFollowMutation.graphql"
import { ArtistSeriesMeta_artistSeries$data } from "__generated__/ArtistSeriesMeta_artistSeries.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { navigate } from "app/system/navigation/navigate"
import { truncatedTextLimit } from "app/utils/hardware"
import { Touchable } from "@artsy/palette-mobile"
import React, { useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistSeriesMetaProps {
  artistSeries: ArtistSeriesMeta_artistSeries$data
  relay: RelayProp
}

type ArtistToFollowOrUnfollow = NonNullable<
  NonNullable<ArtistSeriesMetaProps["artistSeries"]["artists"]>[0]
>

export const ArtistSeriesMeta: React.FC<ArtistSeriesMetaProps> = ({ artistSeries, relay }) => {
  const metaRef = useRef<View | null>(null)
  const { trackEvent } = useTracking()
  const maxChars = truncatedTextLimit()
  const artist = artistSeries?.artists?.[0]

  const trackFollowOrUnfollow = (followArtist: ArtistToFollowOrUnfollow) => {
    const followOrUnfollowArtistProps: FollowedArgs = {
      contextModule: ContextModule.featuredArtists,
      contextOwnerType: OwnerType.artistSeries,
      contextOwnerId: artistSeries?.internalID,
      contextOwnerSlug: artistSeries?.slug,
      ownerId: followArtist.internalID,
      ownerSlug: followArtist.slug,
    }

    const properties = followArtist.isFollowed
      ? unfollowedArtist(followOrUnfollowArtistProps)
      : followedArtist(followOrUnfollowArtistProps)

    trackEvent(properties)
  }

  const followOrUnfollowArtist = (followArtist: ArtistToFollowOrUnfollow) => {
    trackFollowOrUnfollow(followArtist)

    return new Promise<void>((resolve, reject) => {
      commitMutation<ArtistSeriesMetaFollowMutation>(relay.environment, {
        mutation: graphql`
          mutation ArtistSeriesMetaFollowMutation($input: FollowArtistInput!) {
            followArtist(input: $input) {
              artist {
                isFollowed
              }
            }
          }
        `,
        variables: {
          input: { artistID: followArtist.internalID, unfollow: followArtist.isFollowed },
        },
        onError: reject,
        onCompleted: (_response, errors) => {
          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors)))
          } else {
            resolve()
          }
        },
      })
    })
  }

  return (
    <View ref={metaRef}>
      <Text variant="lg-display" testID="title">
        {artistSeries.title}
      </Text>
      {!!artist && (
        <TouchableOpacity
          key={artist.id!}
          onPress={() => {
            navigate(`/artist/${artist.slug}`)
          }}
        >
          <Spacer y={0.5} />
          <EntityHeader
            smallVariant
            name={artist.name!}
            imageUrl={artist.image?.url!}
            FollowButton={
              <Touchable
                onPress={() => followOrUnfollowArtist(artist)}
                hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                haptic
                noFeedback
              >
                <Text variant="sm" style={{ textDecorationLine: "underline" }}>
                  {artist.isFollowed ? "Following" : "Follow"}
                </Text>
              </Touchable>
            }
          />
          <Spacer y={0.5} />
        </TouchableOpacity>
      )}
      <ReadMore
        testID="description"
        content={artistSeries?.description ?? ""}
        maxChars={maxChars}
      />
    </View>
  )
}

export const ArtistSeriesMetaFragmentContainer = createFragmentContainer(ArtistSeriesMeta, {
  artistSeries: graphql`
    fragment ArtistSeriesMeta_artistSeries on ArtistSeries {
      internalID
      slug
      title
      description
      artists(size: 1) {
        id
        internalID
        name
        slug
        isFollowed
        image {
          url
        }
      }
    }
  `,
})
