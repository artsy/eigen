import { Avatar, Flex, Text } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistGridItem_artist$key } from "__generated__/MyCollectionCollectedArtistGridItem_artist.graphql"
import { formatTombstoneText } from "app/Components/ArtistListItem"
import { pluralize } from "app/utils/pluralize"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionCollectedArtistGridItemProps {
  artist: MyCollectionCollectedArtistGridItem_artist$key
  artworksCount: number | null
}

export const MyCollectionCollectedArtistGridItem: React.FC<
  MyCollectionCollectedArtistGridItemProps
> = ({ artist, artworksCount }) => {
  const artistData = useFragment<MyCollectionCollectedArtistGridItem_artist$key>(
    artistFragment,
    artist
  )
  const { nationality, birthday, deathday } = artistData

  const getMeta = () => {
    const tombstoneText = formatTombstoneText(nationality, birthday, deathday)

    if (tombstoneText || Number.isInteger(artworksCount)) {
      return (
        <Flex alignItems="center">
          <Text variant="xs" color="black60">
            {tombstoneText}
          </Text>

          {Number.isInteger(artworksCount) && (
            <Text variant="xs" color={artworksCount === 0 ? "black60" : "black100"}>
              {artworksCount} {pluralize("artwork", artworksCount || 0)} uploaded
            </Text>
          )}
        </Flex>
      )
    }

    return undefined
  }
  const meta = getMeta()

  return (
    <Flex flex={1} maxWidth="50%" alignItems="center">
      <Avatar src={artistData.image?.url || ""} initials={artistData.initials || ""} />
      <Text variant="xs" numberOfLines={2} mt={0.5}>
        {artistData.name ?? ""}
      </Text>
      {meta}
    </Flex>
  )
}

const artistFragment = graphql`
  fragment MyCollectionCollectedArtistGridItem_artist on Artist {
    name
    id
    internalID
    slug
    name
    initials
    href
    is_followed: isFollowed
    nationality
    birthday
    deathday
    image {
      url
    }
  }
`
