import { CollectedArtistList_myCollectionInfo$key } from "__generated__/CollectedArtistList_myCollectionInfo.graphql"
import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { ResultWithHighlight } from "app/Scenes/Search/components/ResultWithHighlight"
import { SearchResultImage } from "app/Scenes/Search/components/SearchResultImage"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Spacer, Touchable } from "palette"
import { FlatList } from "react-native-gesture-handler"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { normalizeText } from "shared/utils"

interface ArtistAutosuggestProps {
  onResultPress: (result: AutosuggestResult) => void
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

  const filteredArtists = searchTerm ? filterArtistsByKeyword(artists, searchTerm) : artists

  return (
    <>
      {/* <Text variant="lg" my={2}>
        - or select one of your collected artists. -
      </Text> */}
      <FlatList
        data={filteredArtists}
        renderItem={({ item }) => (
          <Flex pb={4}>
            <ArtistListItem key={item.id} result={item} />
          </Flex>
        )}
      />
    </>
  )
}

const artworkFragment = graphql`
  fragment CollectedArtistList_myCollectionInfo on MyCollectionInfo {
    collectedArtistsConnection(first: 10) {
      edges {
        node {
          id
          name
          internalID
          insights(kind: [SOLO_SHOW, GROUP_SHOW, COLLECTED, REVIEWED, BIENNIAL]) {
            kind
            count
          }
          imageUrl
        }
      }
    }
  }
`

const ArtistListItem = ({ result, onPress }: any) => {
  return (
    <>
      <Touchable onPress={() => onPress()}>
        <Flex height={10} flexDirection="row" alignItems="center">
          <SearchResultImage imageURL={result.imageUrl} resultType="artist" />

          <Spacer ml={1} />

          <Flex flex={1}>
            <ResultWithHighlight displayLabel={result.name!} />
          </Flex>
        </Flex>
      </Touchable>
    </>
  )
}

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
