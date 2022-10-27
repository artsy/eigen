import { ArtistAutosuggestQuery } from "__generated__/ArtistAutosuggestQuery.graphql"
import SearchIcon from "app/Icons/SearchIcon"
import { AutosuggestResult, AutosuggestResults } from "app/Scenes/Search/AutosuggestResults"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { useFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { Box, Button, Flex, Input, Text } from "palette"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"
import { normalizeText } from "shared/utils"
import { useArtworkForm } from "../Form/useArtworkForm"

interface ArtistAutosuggestProps {
  onResultPress: (result: AutosuggestResult) => void
  onSkipPress?: () => void
}

export const ArtistAutosuggest: React.FC<ArtistAutosuggestProps> = ({
  onResultPress,
  onSkipPress,
}) => {
  const queryData = useLazyLoadQuery<ArtistAutosuggestQuery>(ArtistAutosuggestScreenQuery, {})

  const enableArtworksFromNonArtsyArtists = useFeatureFlag("AREnableArtworksFromNonArtsyArtists")
  const { formik } = useArtworkForm()
  const { artist: artistQuery } = formik.values
  const searchProviderValues = useSearchProviderValues(artistQuery)

  const collectedArtists = extractNodes(queryData.me?.myCollectionInfo?.collectedArtistsConnection)
  const filteredCollecteArtists = filterArtistsByKeyword(collectedArtists, artistQuery).map(
    (artist) => ({ ...artist, __typename: "Artist" })
  )

  const showResults = filteredCollecteArtists.length || artistQuery.length > 2

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Box>
        <Input
          placeholder="Search for artists on Artsy"
          icon={<SearchIcon width={18} height={18} />}
          onChangeText={formik.handleChange("artist")}
          onBlur={formik.handleBlur("artist")}
          value={formik.values.artist}
          enableClearButton
          autoFocus={typeof jest === "undefined"}
          autoCorrect={false}
        />
        {showResults ? (
          <Box height="100%" py={4}>
            <AutosuggestResults
              query={artistQuery}
              prependResults={enableArtworksFromNonArtsyArtists ? filteredCollecteArtists : []}
              entities={["ARTIST"]}
              showResultType={false}
              showQuickNavigationButtons={false}
              onResultPress={onResultPress}
              ListEmptyComponent={() => (
                <Flex width="100%">
                  <Text>We couldn't find any results for "{artistQuery}"</Text>
                  {!!enableArtworksFromNonArtsyArtists && (
                    <Flex alignItems="center" width="100%">
                      <Button variant="outline" onPress={onSkipPress} mt={3} block>
                        Can't find the Artist? Skip ahead
                      </Button>
                    </Flex>
                  )}
                </Flex>
              )}
            />
          </Box>
        ) : null}
      </Box>
    </SearchContext.Provider>
  )
}

const ArtistAutosuggestScreenQuery = graphql`
  query ArtistAutosuggestQuery {
    me {
      myCollectionInfo {
        collectedArtistsConnection(first: 20) {
          edges {
            node {
              internalID
              displayLabel
              slug
              imageUrl
              formattedNationalityAndBirthday
            }
          }
        }
      }
    }
  }
`

export const filterArtistsByKeyword = (
  artists: Array<{ displayLabel: string | null }>,
  keywordFilter: string
) => {
  if (!keywordFilter) {
    return artists
  }

  const normalizedKeywordFilter = normalizeText(keywordFilter)

  if (!normalizedKeywordFilter) {
    return artists
  }

  const keywordFilterWords = normalizedKeywordFilter.split(" ")

  const doAllKeywordFiltersMatch = (artist: { displayLabel: string | null }) =>
    keywordFilterWords.filter((word) => !normalizeText(artist?.displayLabel ?? "").includes(word))
      .length === 0

  return artists.filter(doAllKeywordFiltersMatch)
}
