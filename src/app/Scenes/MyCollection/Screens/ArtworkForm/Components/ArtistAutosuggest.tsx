import { AddIcon } from "@artsy/icons/native"
import { Box, Button, Flex, Input, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import {
  ArtistAutosuggestQuery,
  ArtistAutosuggestQuery$data,
} from "__generated__/ArtistAutosuggestQuery.graphql"
import {
  AutosuggestResult,
  AutosuggestResults,
} from "app/Components/AutosuggestResults/AutosuggestResults"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import { filterArtistsByKeyword } from "app/Scenes/MyCollection/utils/filterArtistsByKeyword"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { IMAGE_SIZE } from "app/Scenes/Search/components/SearchResultImage"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { sortBy } from "lodash"
import { ReactElement, isValidElement } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export type ArtistAutoSuggestNode = NonNullable<
  ExtractNodeType<
    NonNullable<NonNullable<ArtistAutosuggestQuery$data["me"]>["userInterestsConnection"]>
  >
>
interface ArtistAutosuggestProps {
  disableCustomArtists?: boolean
  hideCollectedArtists?: boolean
  Hint?: ReactElement
  loading?: boolean
  onlyP1Artists?: boolean
  onResultPress: (result: AutosuggestResult) => void
  onSkipPress?: (artistDisplayName: string) => void
  autoFocus?: boolean
  disableFormik?: boolean
}

export const ArtistAutosuggest: React.FC<ArtistAutosuggestProps> = ({
  disableCustomArtists,
  hideCollectedArtists = false,
  Hint,
  loading = false,
  onlyP1Artists = false,
  onResultPress,
  onSkipPress,
  autoFocus = typeof jest === "undefined",
  disableFormik = false,
}) => {
  const { formik } = useArtworkForm(disableFormik)
  const { artist: artistQuery } = formik.values
  const trimmedQuery = artistQuery.trimStart()
  const searchProviderValues = useSearchProviderValues(artistQuery)

  const queryData = useLazyLoadQuery<ArtistAutosuggestQuery>(
    ArtistAutosuggestScreenQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  let collectedArtists = !hideCollectedArtists
    ? extractNodes(queryData.me?.userInterestsConnection).filter(
        (node) => node.__typename === "Artist"
      )
    : []

  if (onlyP1Artists) {
    collectedArtists = collectedArtists.filter(
      // This is always true, it's just to make TypeScript happy
      (node) => node.__typename === "Artist" && node.targetSupply?.isTargetSupply
    )
  }

  const filteredCollecteArtists = sortBy(
    filterArtistsByKeyword(
      collectedArtists as Array<{ displayLabel: string | null }>,
      trimmedQuery
    ),
    ["displayLabel"]
  )

  const showResults = filteredCollecteArtists.length || trimmedQuery.length > 2
  const onlyShowCollectedArtists = filteredCollecteArtists.length && trimmedQuery.length < 2

  const HeaderComponent = () => {
    if (disableCustomArtists) {
      return null
    }

    return (
      <>
        <Flex flexDirection="row" mt={1} mb={2}>
          <Text variant="xs" color="mono60">
            Can't find the artist?{" "}
          </Text>
          <Touchable
            accessibilityRole="button"
            onPress={() => onSkipPress?.(trimmedQuery)}
            testID="my-collection-artwork-form-artist-skip-button"
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <Text variant="xs" color="mono60" underline>
              Add their name.
            </Text>
          </Touchable>
        </Flex>
      </>
    )
  }

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
          autoFocus={autoFocus}
          autoCorrect={false}
          spellCheck={false}
          loading={loading}
        />
        {trimmedQuery === "" && isValidElement(Hint) && Hint}
        {showResults ? (
          <Box pb={6}>
            <AutosuggestResults
              query={trimmedQuery}
              prependResults={filteredCollecteArtists}
              entities={["ARTIST"]}
              showResultType={false}
              showQuickNavigationButtons={false}
              onResultPress={onResultPress}
              HeaderComponent={!disableCustomArtists ? HeaderComponent : undefined}
              ListHeaderComponent={() =>
                onlyShowCollectedArtists ? (
                  <Text mb={2}>{onlyP1Artists ? "Eligible" : ""} Artists in My Collection</Text>
                ) : (
                  <Spacer y={1} />
                )
              }
              ListEmptyComponent={() => (
                <Flex width="100%" my={2}>
                  <Text>We didn't find "{trimmedQuery}" on Artsy.</Text>
                  {!disableCustomArtists && (
                    <>
                      <Text>You can add their name in the artwork details.</Text>
                      <Button
                        variant="outline"
                        onPress={() => onSkipPress?.(trimmedQuery)}
                        mt={4}
                        block
                      >
                        Add Artist
                      </Button>
                    </>
                  )}
                </Flex>
              )}
              ListFooterComponent={() =>
                !disableCustomArtists && !onlyShowCollectedArtists ? (
                  <Touchable
                    accessibilityLabel="Create New Artist"
                    haptic
                    onPress={() => onSkipPress?.(trimmedQuery)}
                    testID="autosuggest-search-result-add-new-artist"
                  >
                    <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
                      <Flex
                        alignItems="center"
                        backgroundColor="mono5"
                        border="1px solid"
                        borderColor="mono15"
                        borderRadius={IMAGE_SIZE / 2}
                        height={IMAGE_SIZE}
                        justifyContent="center"
                        width={IMAGE_SIZE}
                      >
                        <AddIcon height={IMAGE_SIZE / 2} width={IMAGE_SIZE / 2} fill="mono60" />
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
      userInterestsConnection(first: 100, category: COLLECTED_BEFORE, interestType: ARTIST)
        @connection(key: "MyCollectionCollectedArtistsRail_userInterestsConnection") {
        edges {
          internalID
          node {
            ... on Artist {
              __typename

              counts {
                artworks
              }
              targetSupply {
                isTargetSupply
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
