import { ArtistAutosuggestQuery } from "__generated__/ArtistAutosuggestQuery.graphql"
import SearchIcon from "app/Icons/SearchIcon"
import { AutosuggestResult, AutosuggestResults } from "app/Scenes/Search/AutosuggestResults"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Box, Button, Flex, Input, Text } from "palette"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"
import { useArtworkForm } from "../Form/useArtworkForm"
import { CollectedArtistList } from "./CollectedArtistList"

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
        {!!enableArtworksFromNonArtsyArtists && (
          <Flex mt={2}>
            <CollectedArtistList
              myCollectionInfo={queryData.me?.myCollectionInfo!}
              onResultPress={onResultPress}
              searchTerm={formik.values.artist}
            />
          </Flex>
        )}
        {artistQuery.length > 2 ? (
          <Box height="200px" py={4}>
            <AutosuggestResults
              query={artistQuery}
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
          </Flex>
        ) : null}
      </Box>
    </SearchContext.Provider>
  )
}

const ArtistAutosuggestScreenQuery = graphql`
  query ArtistAutosuggestQuery {
    me {
      myCollectionInfo {
        ...CollectedArtistList_myCollectionInfo
      }
    }
  }
`
