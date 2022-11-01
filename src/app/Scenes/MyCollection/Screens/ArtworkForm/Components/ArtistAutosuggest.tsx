import { ArtistAutosuggestQuery } from "__generated__/ArtistAutosuggestQuery.graphql"
import SearchIcon from "app/Icons/SearchIcon"
import { AutosuggestResult, AutosuggestResults } from "app/Scenes/Search/AutosuggestResults"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { useFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { sortBy } from "lodash"
import { Box, Button, Flex, Input, Spacer, Text, Touchable } from "palette"
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
  const enableArtworksFromNonArtsyArtists = useFeatureFlag("AREnableArtworksFromNonArtsyArtists")
  const { formik } = useArtworkForm()
  const { artist: artistQuery } = formik.values
  const searchProviderValues = useSearchProviderValues(artistQuery)

  const queryData = useLazyLoadQuery<ArtistAutosuggestQuery>(
    ArtistAutosuggestScreenQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  const collectedArtists = extractNodes(queryData.me?.myCollectionInfo?.collectedArtistsConnection)
  const filteredCollecteArtists = enableArtworksFromNonArtsyArtists
    ? sortBy(filterArtistsByKeyword(collectedArtists, artistQuery), ["displayLabel"])
    : []

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
        {!enableArtworksFromNonArtsyArtists && <Spacer mb={1} />}
        {showResults ? (
          <Box height="100%">
            <AutosuggestResults
              query={artistQuery}
              prependResults={filteredCollecteArtists}
              entities={["ARTIST"]}
              showResultType={false}
              showQuickNavigationButtons={false}
              onResultPress={onResultPress}
              ListHeaderComponent={() =>
                enableArtworksFromNonArtsyArtists ? (
                  <Touchable
                    onPress={onSkipPress}
                    testID="my-collection-artwork-form-artist-skip-button"
                  >
                    <Flex flexDirection="row" my={1}>
                      <Text variant="xs" color="black60">
                        Or skip ahead to{" "}
                      </Text>
                      <Text variant="xs" color="black60" underline>
                        add artwork details
                      </Text>
                    </Flex>
                  </Touchable>
                ) : null
              }
              ListEmptyComponent={() =>
                enableArtworksFromNonArtsyArtists ? (
                  <Flex width="100%" my={2}>
                    <Text>We didn't find "{artistQuery}" on Artsy.</Text>
                    <Text>You can add their name in the artwork details.</Text>
                    <Button variant="outline" onPress={onSkipPress} mt={4} block>
                      Add Artist
                    </Button>
                  </Flex>
                ) : (
                  <Flex width="100%">
                    <Text>We couldn't find any results for "{artistQuery}"</Text>
                  </Flex>
                )
              }
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
        collectedArtistsConnection(first: 100) {
          edges {
            node {
              __typename
              displayLabel
              formattedNationalityAndBirthday
              imageUrl
              initials
              internalID
              isPersonalArtist
              slug
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
  if (keywordFilter?.length < 2) {
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
