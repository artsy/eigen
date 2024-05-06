import { Box, Input } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { AnimateHeight } from "app/utils/animations/AnimateHeight"
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
    validateField,
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
      <AnimateHeight initialHeight={140}>
        <Input
          title={title || undefined}
          placeholder={placeholder}
          icon={<SearchIcon width={18} height={18} />}
          onChangeText={(e) => {
            onArtistSearchTextChange(e)
          }}
          value={artist}
          autoCorrect={false}
          accessibilityLabel="Artist"
          onBlur={() => {
            setFocused(false)
            validateField("artistId")
          }}
          onFocus={() => setFocused(true)}
          enableClearButton
          onClear={() => {
            setFocused(false)
            validateField("artistId")
            setIsArtistSelected(false)
          }}
          testID="Submission_ArtistInput"
          error={!focused && !isArtistSelected ? errors.artistId : undefined}
          required
        />
      </AnimateHeight>

      {!!focused && !isArtistSelected && artist?.length > 2 && (
        <Box height={200}>
          <ArtistAutosuggestResults query={artist} onResultPress={onArtistSelect} />
        </Box>
      )}
    </SearchContext.Provider>
  )
}
