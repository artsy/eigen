import { Box, Input } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"
import React, { useEffect, useState } from "react"
import { ArtistAutosuggestResult, ArtistAutosuggestResults } from "./ArtistAutosuggestResults"

interface ArtistAutosuggestProps {
  placeholder?: string
  title?: string | null
  useSlugAsId?: boolean
}

export const ArtistAutosuggest: React.FC<ArtistAutosuggestProps> = ({
  placeholder = "Enter full name",
  title = "Artist",
  useSlugAsId,
}) => {
  const {
    values: { artist, artistId },
    setFieldValue,
    errors,
  } = useFormikContext<ArtworkDetailsFormModel>()
  const searchProviderValues = useSearchProviderValues(artist)

  const [isArtistSelected, setIsArtistSelected] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (artist && artistId) {
      setIsArtistSelected(true)
    }
  }, [])

  const onArtistSearchTextChange = (e: string) => {
    setFocused(true)
    setIsArtistSelected(false)
    setFieldValue("artist", e)
    setFieldValue("artistId", "")
  }

  const onArtistSelect = (result: ArtistAutosuggestResult) => {
    setFieldValue("artist", result.displayLabel)
    setFieldValue("artistId", useSlugAsId ? result.slug : result.internalID)
    setIsArtistSelected(true)
    setFocused(false)
  }

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Input
        title={title || undefined}
        placeholder={placeholder}
        icon={<SearchIcon width={18} height={18} />}
        onChangeText={onArtistSearchTextChange}
        value={artist}
        accessibilityLabel="Artist"
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        enableClearButton
        testID="Submission_ArtistInput"
        error={!focused && artist && !isArtistSelected ? errors.artistId : undefined}
      />

      {!!focused && !isArtistSelected && artist?.length > 2 && (
        <Box height={200}>
          <ArtistAutosuggestResults query={artist} onResultPress={onArtistSelect} />
        </Box>
      )}
    </SearchContext.Provider>
  )
}
