import { AddIcon, Box, Button, Flex, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { ArtistAutosuggestQuery } from "__generated__/ArtistAutosuggestQuery.graphql"
import {
  AutosuggestResult,
  AutosuggestResults,
} from "app/Components/AutosuggestResults/AutosuggestResults"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { Input } from "app/Components/Input"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { IMAGE_SIZE } from "app/Scenes/Search/components/SearchResultImage"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { normalizeText } from "app/utils/normalizeText"
import { sortBy } from "lodash"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"

interface ArtistAutosuggestProps {
  onResultPress: (result: AutosuggestResult) => void
  onSkipPress?: (artistDisplayName: string) => void
}

export const ArtistAutosuggest: React.FC<ArtistAutosuggestProps> = ({
  onResultPress,
  onSkipPress,
}) => {
  const enableArtworksFromNonArtsyArtists = useFeatureFlag("AREnableArtworksFromNonArtsyArtists")
  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")

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
        {!enableArtworksFromNonArtsyArtists && <Spacer y={1} />}
        {showResults ? (
          <Box height="100%" mt={enableArtworksFromNonArtsyArtists ? 0 : 2} pb={6}>
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
                ) : enableArtworksFromNonArtsyArtists ? (
                  <Spacer y={2} />
                ) : null
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
              ListFooterComponent={() =>
                !onlyShowCollectedArtists && !!enableCollectedArtists ? (
                  <Touchable
                    accessibilityLabel="Create New Artist"
                    haptic
                    onPress={() => onSkipPress?.(trimmedQuery)}
                    testID="autosuggest-search-result-add-new-artist"
                  >
                    <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
                      <Flex
                        alignItems="center"
                        backgroundColor="black5"
                        border="1px solid"
                        borderColor="black15"
                        borderRadius={IMAGE_SIZE / 2}
                        height={IMAGE_SIZE}
                        justifyContent="center"
                        width={IMAGE_SIZE}
                      >
                        <AddIcon height={IMAGE_SIZE / 2} width={IMAGE_SIZE / 2} fill="black60" />
                      </Flex>
                      <Spacer x={1} />
                      <Text variant="xs">Create New Artist</Text>
                    </Flex>
                  </Touchable>
                ) : (
                  <></>
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
        collectedArtistsConnection(first: 100, includePersonalArtists: true) {
          edges {
            node {
              __typename
              counts {
                artworks
              }
              targetSupply {
                isP1
              }
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
