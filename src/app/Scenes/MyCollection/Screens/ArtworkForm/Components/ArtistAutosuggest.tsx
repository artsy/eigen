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
  onSkipPress?: (artistDisplayName: string) => void
}

export const ArtistAutosuggest: React.FC<ArtistAutosuggestProps> = ({
  onResultPress,
  onSkipPress,
}) => {
  const enableArtworksFromNonArtsyArtists = useFeatureFlag("AREnableArtworksFromNonArtsyArtists")
  const { formik } = useArtworkForm()
  const { artist: artistQuery } = formik.values
  const trimmedQuery = artistQuery.trimStart()
  const searchProviderValues = useSearchProviderValues(artistQuery)

  const queryData = useLazyLoadQuery<ArtistAutosuggestQuery>(
    ArtistAutosuggestScreenQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  const collectedArtists = extractNodes(queryData.me?.myCollectionInfo?.collectedArtistsConnection)
  const filteredCollecteArtists = enableArtworksFromNonArtsyArtists
    ? sortBy(filterArtistsByKeyword(collectedArtists, trimmedQuery), ["displayLabel"])
    : []

  const showResults = filteredCollecteArtists.length || trimmedQuery.length > 2
  const onlyShowCollectedArtists = filteredCollecteArtists.length && trimmedQuery.length < 2

  const HeaderComponent = () =>
    enableArtworksFromNonArtsyArtists ? (
      <>
        <Flex flexDirection="row" mt={1} mb={2}>
          <Text variant="xs" color="black60">
            Can't find the artist?{" "}
          </Text>
          <Touchable
            onPress={() => onSkipPress?.(trimmedQuery)}
            testID="my-collection-artwork-form-artist-skip-button"
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <Text variant="xs" color="black60" underline>
              Add their name.
            </Text>
          </Touchable>
        </Flex>
      </>
    ) : (
      <></>
    )

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
          <Box height="100%" mt={enableArtworksFromNonArtsyArtists ? 0 : 2}>
            <AutosuggestResults
              query={trimmedQuery}
              prependResults={filteredCollecteArtists}
              entities={["ARTIST"]}
              showResultType={false}
              showQuickNavigationButtons={false}
              onResultPress={onResultPress}
              HeaderComponent={HeaderComponent}
              ListHeaderComponent={() =>
                enableArtworksFromNonArtsyArtists && onlyShowCollectedArtists ? (
                  <Text mb={2} mt={2}>
                    Artists in My Collection
                  </Text>
                ) : (
                  <Spacer mb={enableArtworksFromNonArtsyArtists ? 2 : 0} />
                )
              }
              ListEmptyComponent={() =>
                enableArtworksFromNonArtsyArtists ? (
                  <Flex width="100%" my={2}>
                    <Text>We didn't find "{trimmedQuery}" on Artsy.</Text>
                    <Text>You can add their name in the artwork details.</Text>
                    <Button
                      variant="outline"
                      onPress={() => onSkipPress?.(trimmedQuery)}
                      mt={4}
                      block
                    >
                      Add Artist
                    </Button>
                  </Flex>
                ) : (
                  <Flex width="100%">
                    <Text>We couldn't find any results for "{trimmedQuery}"</Text>
                  </Flex>
                )
              }
            />
          </Box>
        ) : (
          <HeaderComponent />
        )}
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
  if (keywordFilter.length < 2) {
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
