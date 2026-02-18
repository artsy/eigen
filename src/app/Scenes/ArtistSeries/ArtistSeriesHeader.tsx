import {
  ContextModule,
  FollowedArgs,
  followedArtist,
  OwnerType,
  unfollowedArtist,
} from "@artsy/cohesion"
import { Box, Image, Text } from "@artsy/palette-mobile"
import { ArtistSeriesHeader_artistSeries$data } from "__generated__/ArtistSeriesHeader_artistSeries.graphql"
import { useArtistHeaderImageDimensions } from "app/Components/Artist/ArtistHeader"
import { ArtistListItemNew } from "app/Scenes/Onboarding/Screens/OnboardingQuiz/Components/ArtistListItem"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtistSeriesHeaderProps {
  artistSeries: ArtistSeriesHeader_artistSeries$data
  relay: any
}

type ArtistToFollowOrUnfollow = NonNullable<
  NonNullable<ArtistSeriesHeaderProps["artistSeries"]["artists"]>[0]
>

export const ArtistSeriesHeader: React.FC<ArtistSeriesHeaderProps> = ({ artistSeries }) => {
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

  const { aspectRatio, width, height } = useArtistHeaderImageDimensions()

  return (
    <>
      <Box mb={2} pointerEvents="none" alignItems="center">
        {!!image?.url && (
          <Image
            testID="ArtistSeriesHeaderImage"
            src={image?.url}
            width={width}
            aspectRatio={aspectRatio}
            height={height}
          />
        )}
      </Box>
      <Box pointerEvents="none">
        <Text variant="lg-display" mx={2}>
          {title}
        </Text>
      </Box>
      <Box mt={2} mx={2}>
        {!!artist && (
          <ArtistListItemNew artist={artist} onFollow={() => trackFollowOrUnfollow(artist)} />
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
        ...ArtistListItemNew_artist
        id
        internalID
        name
        slug
        isFollowed
      }
    }
  `,
})
