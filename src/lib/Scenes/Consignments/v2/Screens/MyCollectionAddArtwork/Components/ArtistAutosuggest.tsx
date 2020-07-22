import { Box, Sans, Spacer } from "@artsy/palette"
import { Input } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import { AutosuggestResults } from "lib/Scenes/Search/AutosuggestResults"
import { ProvideRecentSearches } from "lib/Scenes/Search/RecentSearches"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import React from "react"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtistSearchResult } from "./ArtistSearchResult"

export const ArtistAutosuggest: React.FC = () => {
  const artworkActions = useStoreActions(actions => actions.artwork)
  const { formik } = useArtworkForm()
  const { artist: artistQuery, artistSearchResult } = formik.values
  const searchProviderValues = useSearchProviderValues(artistQuery)

  return (
    <>
      {!!artistSearchResult ? (
        <>
          <Sans size="3t" mt="2px">
            Artist
          </Sans>
          <Spacer mt={0.5} />
          <ArtistSearchResult result={artistSearchResult} />
        </>
      ) : (
        <ProvideRecentSearches>
          <SearchContext.Provider value={searchProviderValues}>
            <Box>
              <Input
                title="Artist"
                placeholder="Search artists"
                icon={<SearchIcon width={18} height={18} />}
                onChangeText={formik.handleChange("artist")}
                onBlur={formik.handleBlur("artist")}
                value={formik.values.artist}
              />

              {artistQuery.length > 2 ? (
                <Box height="100%">
                  <AutosuggestResults
                    query={artistQuery}
                    entities={["ARTIST"]}
                    showResultType={false}
                    onResultPress={artworkActions.setArtistSearchResult}
                  />
                </Box>
              ) : null}
            </Box>
          </SearchContext.Provider>
        </ProvideRecentSearches>
      )}
    </>
  )
}
