import { useFormikContext } from "formik"
import SearchIcon from "lib/Icons/SearchIcon"
import { SearchContext, useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { Box, Input } from "palette"
import React, { useEffect, useState } from "react"
import { ArtworkDetailsFormModel } from "../../utils/validation"
import { ArtistAutosuggestResult, ArtistAutosuggestResults } from "./ArtistAutosuggestResults"

export const ArtistAutosuggest: React.FC<{}> = () => {
  const {
    values: { artist, artistId },
    setFieldValue,
    errors,
  } = useFormikContext<ArtworkDetailsFormModel>()
  const searchProviderValues = useSearchProviderValues(artist)

  console.log({ artist, artistId })

  const [isArtistSelected, setIsArtistSelected] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (artist && artistId) {
      setIsArtistSelected(true)
    }
  }, [artist, artistId])

  const onArtistSearchTextChange = (e: string) => {
    setIsArtistSelected(false)
    setFieldValue("artist", e)
    setFieldValue("artistId", "")
  }

  const onArtistSelect = (result: ArtistAutosuggestResult) => {
    setFieldValue("artist", result.displayLabel)
    setFieldValue("artistId", result.internalID)
    setIsArtistSelected(true)
    setFocused(false)
  }

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Input
        title="Artist"
        placeholder="Enter Full Name"
        icon={<SearchIcon width={18} height={18} />}
        onChangeText={onArtistSearchTextChange}
        value={artist}
        onBlur={() => setFocused(false)}
        onFocus={() => {
          setIsArtistSelected(false)
          setFocused(true)
        }}
        enableClearButton
        autoFocus={typeof jest === "undefined"}
        error={!focused ? errors.artistId : undefined}
      />

      {!!focused && !isArtistSelected && artist?.length > 2 && (
        <Box height={198}>
          <ArtistAutosuggestResults query={artist} onResultPress={onArtistSelect} />
        </Box>
      )}
    </SearchContext.Provider>
  )
}
