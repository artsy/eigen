import { Flex } from "@artsy/palette-mobile"
import { ArtistHeaderNavRightQuery } from "__generated__/ArtistHeaderNavRightQuery.graphql"
import { ArtistHeaderNavRight_artist$key } from "__generated__/ArtistHeaderNavRight_artist.graphql"
// @ts-ignore
import { ArtistHeaderNavRight as ArtistHeaderNavRightFragmentContainer } from "app/Components/Artist/ArtistHeaderNavRightFragmentContainer"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ArtistHeaderNavRightProps {
  artist: ArtistHeaderNavRight_artist$key
}

export const ArtistHeaderNavRight: React.FC<ArtistHeaderNavRightProps> = ({
  artist: artistProp,
}) => {
  return <ArtistHeaderNavRightFragmentContainer artist={artistProp} />
}

export const artistHeaderNavRightFragment = graphql`
  fragment ArtistHeaderNavRight_artist on Artist {
    isFollowed
    counts @required(action: NONE) {
      follows
    }
    name
    slug
    href
    internalID
    shareImage: coverArtwork {
      image {
        url
      }
    }
    ...useFollowArtist_artist
  }
`

const artistHeaderNavRightQuery = graphql`
  query ArtistHeaderNavRightQuery($artistID: String!) {
    artist(id: $artistID) @required(action: NONE) {
      ...ArtistHeaderNavRight_artist
    }
  }
`

interface ArtistHeaderNavRightQueryRendererProps {
  artistID: string
}

export const ArtistHeaderNavRightQueryRenderer: React.FC<ArtistHeaderNavRightQueryRendererProps> =
  withSuspense({
    Component: ({ artistID }) => {
      const data = useLazyLoadQuery<ArtistHeaderNavRightQuery>(artistHeaderNavRightQuery, {
        artistID,
      })

      if (!data?.artist) {
        return null
      }

      return <ArtistHeaderNavRight artist={data.artist} />
    },
    // We don't want to show a loading fallback here because it degrades the UX in this case
    LoadingFallback: () => <Flex />,
    // We don't want to show an error fallback just because the button didn't render
    // We would still capture it though
    ErrorFallback: NoFallback,
  })
