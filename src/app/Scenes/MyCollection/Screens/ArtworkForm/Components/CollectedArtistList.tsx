import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { CollectedArtistList_myCollectionInfo$key } from "__generated__/CollectedArtistList_myCollectionInfo.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { extractNodes } from "app/utils/extractNodes"
import { Spacer } from "palette"
import { FlatList } from "react-native-gesture-handler"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { normalizeText } from "shared/utils"

interface ArtistAutosuggestProps {
  onResultPress: (result: ArtistListItem_artist$data) => void
  myCollectionInfo: CollectedArtistList_myCollectionInfo$key
  searchTerm: string | null
}

export const CollectedArtistList: React.FC<ArtistAutosuggestProps> = ({
  onResultPress,
  searchTerm,
  ...rest
}) => {
  const myCollectionInfo = useFragment(artworkFragment, rest.myCollectionInfo)

  const artists = extractNodes(myCollectionInfo.collectedArtistsConnection)

  // const filteredArtists = searchTerm ? filterArtistsByKeyword(artists, searchTerm) : artists

  return (
    <>
      <FlatList
        data={artists}
        renderItem={({ item: artist }) => (
          <ArtistListItemContainer
            artist={artist}
            containerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
            disableNavigation
            hideFollowButton
            onPress={(artistResult) => onResultPress(artistResult)}
          />
        )}
        ItemSeparatorComponent={() => <Spacer mb={2} />}
        keyExtractor={(artist) => artist.internalID}
      />
    </>
  )
}

const artworkFragment = graphql`
  fragment CollectedArtistList_myCollectionInfo on MyCollectionInfo {
    collectedArtistsConnection(first: 10) {
      edges {
        node {
          internalID
          ...ArtistListItem_artist
        }
      }
    }
  }
`

export const filterArtistsByKeyword = (artists: any, keywordFilter: string) => {
  const normalizedKeywordFilter = normalizeText(keywordFilter)

  if (!normalizedKeywordFilter) {
    return artists
  }

  const keywordFilterWords = normalizedKeywordFilter.split(" ")

  const doAllKeywordFiltersMatch = (artist: { name: string | null }) =>
    keywordFilterWords.filter((word) => !normalizeText(artist?.name ?? "").includes(word))
      .length === 0

  return artists.filter(doAllKeywordFiltersMatch)
}
