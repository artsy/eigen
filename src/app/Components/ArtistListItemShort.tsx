import { EntityHeader, Flex, Touchable } from "@artsy/palette-mobile"
import { ArtistListItemShortQuery } from "__generated__/ArtistListItemShortQuery.graphql"
import { ArtistListItemShort_artist$key } from "__generated__/ArtistListItemShort_artist.graphql"
import { ArtistFollowButtonQueryRenderer } from "app/Components/ArtistFollowButton"
import { ReadMore } from "app/Components/ReadMore"
import { navigate } from "app/system/navigation/navigate"
import { truncatedTextLimit } from "app/utils/hardware"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface ArtistListItemShortProps {
  artist: ArtistListItemShort_artist$key
}

export const ArtistListItemShort: FC<ArtistListItemShortProps> = ({ artist }) => {
  const data = useFragment(fragment, artist)

  if (!data) {
    return null
  }

  const image = data.coverArtwork?.image?.cropped?.url ?? undefined
  const bio = data?.biographyBlurb?.text
  const bioTextLimit = truncatedTextLimit()

  const handleOnPress = () => {
    navigate(data.href)
  }

  return (
    <>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Touchable onPress={handleOnPress} style={{ flex: 1 }}>
          <EntityHeader
            name={data.name}
            initials={data.initials}
            imageUrl={image}
            meta={data.formattedNationalityAndBirthday ?? undefined}
            RightButton={<ArtistFollowButtonQueryRenderer artistID={data.internalID} />}
          />
        </Touchable>
      </Flex>

      {!!bio && (
        <ReadMore content={bio} maxChars={bioTextLimit} textVariant="xs" linkTextVariant="xs" />
      )}
    </>
  )
}

const fragment = graphql`
  fragment ArtistListItemShort_artist on Artist {
    internalID @required(action: NONE)
    name @required(action: NONE)
    initials @required(action: NONE)
    href @required(action: NONE)
    formattedNationalityAndBirthday

    coverArtwork {
      image {
        cropped(height: 45, width: 45) {
          url
        }
      }
    }
    biographyBlurb {
      text
    }
  }
`

interface ArtworkListItemShortWithSuspenseProps {
  artistSlug: string
}

export const ArtworkListItemShortWithSuspense = withSuspense<ArtworkListItemShortWithSuspenseProps>(
  {
    Component: ({ artistSlug }) => {
      const data = useLazyLoadQuery<ArtistListItemShortQuery>(query, { slug: artistSlug })

      if (!data?.artist) {
        return null
      }

      return <ArtistListItemShort artist={data.artist} />
    },
    LoadingFallback: () => null,
    ErrorFallback: () => null,
  }
)

const query = graphql`
  query ArtistListItemShortQuery($slug: String!) {
    artist(id: $slug) {
      ...ArtistListItemShort_artist
      name
    }
  }
`
