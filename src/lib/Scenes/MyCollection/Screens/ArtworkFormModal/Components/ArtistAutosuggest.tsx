import { Input } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import { AutosuggestResults } from "lib/Scenes/Search/AutosuggestResults"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { GlobalStore } from "lib/store/GlobalStore"
import { Box, Sans, Spacer } from "palette"
import React from "react"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtistSearchResult } from "./ArtistSearchResult"

export const ArtistAutosuggest: React.FC = () => {
  const { formik } = useArtworkForm()
  const { artist: artistQuery, artistSearchResult } = formik.values
  const searchProviderValues = useSearchProviderValues(artistQuery)

  return (
    <>
      {!!artistSearchResult ? (
        <>
          <Sans size="3" mt="2" weight="medium">
            Artist
          </Sans>
          <Spacer mt="0.5" />
          <ArtistSearchResult result={artistSearchResult} />
        </>
      ) : (
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
                  onResultPress={GlobalStore.actions.myCollection.artwork.setArtistSearchResult}
                />
              </Box>
            ) : null}
          </Box>
        </SearchContext.Provider>
      )}
    </>
  )
}
