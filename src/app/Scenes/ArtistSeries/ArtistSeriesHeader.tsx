import {
  ContextModule,
  FollowedArgs,
  followedArtist,
  OwnerType,
  unfollowedArtist,
} from "@artsy/cohesion"
import {
  Box,
  EntityHeader,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { ArtistSeriesHeaderFollowMutation } from "__generated__/ArtistSeriesHeaderFollowMutation.graphql"
import { ArtistSeriesHeader_artistSeries$data } from "__generated__/ArtistSeriesHeader_artistSeries.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/system/navigation/navigate"
import { TouchableOpacity } from "react-native"
import { commitMutation, createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistSeriesHeaderProps {
  artistSeries: ArtistSeriesHeader_artistSeries$data
  relay: any
}

type ArtistToFollowOrUnfollow = NonNullable<
  NonNullable<ArtistSeriesHeaderProps["artistSeries"]["artists"]>[0]
>

export const ArtistSeriesHeader: React.FC<ArtistSeriesHeaderProps> = ({ artistSeries, relay }) => {
  const { width } = useScreenDimensions()
  const { trackEvent } = useTracking()
  const { title, image, artists, internalID, slug } = artistSeries
  const artist = artists?.[0]

  const trackFollowOrUnfollow = (followArtist: ArtistToFollowOrUnfollow) => {
    const followOrUnfollowArtistProps: FollowedArgs = {
      contextModule: ContextModule.featuredArtists,
      contextOwnerType: OwnerType.artistSeries,
      contextOwnerId: internalID,
      contextOwnerSlug: slug,
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
      commitMutation<ArtistSeriesHeaderFollowMutation>(relay.environment, {
        mutation: graphql`
          mutation ArtistSeriesHeaderFollowMutation($input: FollowArtistInput!) {
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
    <>
      <Box mb={2} pointerEvents="none" alignItems="center">
        <OpaqueImageView
          testID="ArtistSeriesHeaderImage"
          imageURL={image?.url}
          width={width / 1.18}
          aspectRatio={image?.aspectRatio}
        />
      </Box>
      <Box pointerEvents="none">
        <Text variant="lg-display" mx={2}>
          {title}
        </Text>
      </Box>
      {/* // TODO: add artist follow from artist series */}
      <Box mt={2} ml={2}>
        {!!artist && (
          <TouchableOpacity
            key={artist.id}
            onPress={() => {
              navigate(`/artist/${artist.slug}`)
            }}
          >
            <Spacer y={0.5} />
            <EntityHeader
              smallVariant
              name={artist.name ?? ""}
              imageUrl={artist.image?.url ?? ""}
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
      </Box>
    </>
  )
}

export const ArtistSeriesHeaderFragmentContainer = createFragmentContainer(ArtistSeriesHeader, {
  artistSeries: graphql`
    fragment ArtistSeriesHeader_artistSeries on ArtistSeries {
      title
      internalID
      slug
      image {
        aspectRatio
        url(version: "larger")
      }
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
