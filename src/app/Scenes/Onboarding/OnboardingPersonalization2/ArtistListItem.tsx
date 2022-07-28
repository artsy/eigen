import { ArtistListItemNew_artist$key } from "__generated__/ArtistListItemNew_artist.graphql"
import { EntityHeader, Flex, FlexProps, FollowButton } from "palette"
import { graphql, useFragment, useMutation } from "react-relay"
import { formatTombstoneText } from "../OnboardingPersonalization/OnboardingPersonalizationArtistListItem"

interface ArtistListItemProps extends FlexProps {
  artist: ArtistListItemNew_artist$key
}

export const ArtistListItemNew: React.FC<ArtistListItemProps> = ({ artist, ...rest }) => {
  const { name, nationality, birthday, deathday, initials, image, isFollowed, slug } =
    useFragment<ArtistListItemNew_artist$key>(ArtistListItemFragment, artist)

  const [commit, isInFlight] = useMutation(FollowArtistMutation)

  const handleFollowArtist = () => {
    commit({
      variables: {
        input: {
          artistID: slug,
          unfollow: isFollowed,
        },
      },
    })
  }

  return (
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" {...rest}>
      <Flex flex={1}>
        <EntityHeader
          mr={1}
          name={name!}
          meta={formatTombstoneText(nationality, birthday, deathday) ?? undefined}
          imageUrl={image?.url ?? undefined}
          initials={initials ?? undefined}
        />
      </Flex>
      <Flex>
        <FollowButton
          haptic
          isFollowed={!!isFollowed}
          onPress={handleFollowArtist}
          loading={isInFlight}
          disabled={isInFlight}
        />
      </Flex>
    </Flex>
  )
}

const FollowArtistMutation = graphql`
  mutation ArtistListItemNewFollowArtistMutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        is_followed: isFollowed
      }
    }
  }
`

const ArtistListItemFragment = graphql`
  fragment ArtistListItemNew_artist on Artist {
    id
    internalID
    slug
    name
    initials
    href
    isFollowed
    nationality
    birthday
    deathday
    image {
      url
    }
  }
`
