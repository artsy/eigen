import SearchIcon from "lib/Icons/SearchIcon"
import { AutosuggestResult, AutosuggestResults } from "lib/Scenes/Search/AutosuggestResults"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { Box, Input } from "palette"
import React from "react"
import { useArtworkForm } from "./utils/useArtworkForm"

interface ArtistAutosuggestProps {
  onResultPress: (result: AutosuggestResult) => void
}

export const ArtistAutosuggest: React.FC<ArtistAutosuggestProps> = ({ onResultPress }) => {
  const { formik } = useArtworkForm()
  const { artist: artistQuery } = formik.values
  const searchProviderValues = useSearchProviderValues(artistQuery)

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Box>
        <Input
          title="Artist"
          placeholder="Search for Artists on Artsy"
          icon={<SearchIcon width={18} height={18} />}
          onChangeText={formik.handleChange("artist")}
          onBlur={formik.handleBlur("artist")}
          value={formik.values.artist}
          enableClearButton
          autoFocus={typeof jest === "undefined"}
        />

        {artistQuery.length > 2 ? (
          <>
            <Box height="100%">
              <AutosuggestResults
                query={artistQuery}
                entities={["ARTIST"]}
                showOnRetryErrorMessage
                onResultPress={onResultPress}
              />
            </Box>
          </>
        ) : null}
      </Box>
    </SearchContext.Provider>
  )
}
