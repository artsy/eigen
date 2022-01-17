import { useFormikContext } from "formik"
import SearchIcon from "lib/Icons/SearchIcon"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { Box, Input } from "palette"
import React, { useState } from "react"
import { ArtworkDetailsFormModel } from "../ArtworkDetailsForm"
import { ArtistAutosuggestResult, ArtistAutosuggestResults } from "./ArtistAutosuggestResults"

export const ArtistAutosuggest: React.FC = () => {
  const {
    values: { artist },
    setFieldValue,
  } = useFormikContext<ArtworkDetailsFormModel>()
  const searchProviderValues = useSearchProviderValues(artist)

  const [isArtistSelected, setIsArtistSelected] = useState(false)

  const onArtistSearchTextChange = (e: string) => {
    setIsArtistSelected(false)
    setFieldValue("artist", e)
    setFieldValue("artistId", "")
  }

  const onArtistSelect = (result: ArtistAutosuggestResult) => {
    setFieldValue("artist", result.displayLabel)
    setFieldValue("artistId", result.internalID)
    setIsArtistSelected(true)
  }

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Input
        title="Artist"
        placeholder="Enter Full Name"
        icon={<SearchIcon width={18} height={18} />}
        onChangeText={onArtistSearchTextChange}
        value={artist}
        enableClearButton
        autoFocus={typeof jest === "undefined"}
      />

      {!isArtistSelected && artist.length > 2 ? (
        <>
          <Box height={198}>
            <ArtistAutosuggestResults query={artist} onResultPress={onArtistSelect} />
          </Box>
        </>
      ) : null}
    </SearchContext.Provider>
  )
}
