import { Flex, FlexProps, EntityHeader, FollowButton } from "@artsy/palette-mobile"
import { ArtistListItemNew_artist$key } from "__generated__/ArtistListItemNew_artist.graphql"
import { formatTombstoneText } from "app/Components/ArtistListItem"
import { graphql, useFragment, useMutation } from "react-relay"

interface ArtistListItemProps extends FlexProps {
  artist: ArtistListItemNew_artist$key
  onFollow: () => void
}

export const ArtistListItemNew: React.FC<ArtistListItemProps> = ({ artist, onFollow, ...rest }) => {
  const { name, nationality, birthday, deathday, initials, coverArtwork, isFollowed, slug } =
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
      onCompleted() {
        onFollow()
      },
    })
  }

  return (
    <Flex {...rest}>
      <EntityHeader
        mr={1}
        name={name ?? ""}
        meta={formatTombstoneText(nationality, birthday, deathday) ?? undefined}
        imageUrl={coverArtwork?.image?.url ?? undefined}
        initials={initials ?? undefined}
        FollowButton={
          <FollowButton
            haptic
            isFollowed={!!isFollowed}
            onPress={handleFollowArtist}
            loading={isInFlight}
            disabled={isInFlight}
          />
        }
      />
    </Flex>
  )
}

const FollowArtistMutation = graphql`
  mutation ArtistListItemNewFollowArtistMutation($input: FollowArtistInput!) {
    followArtist(input: $input) {
      artist {
        id
        isFollowed
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
    coverArtwork {
      image {
        url
      }
    }
  }
`
