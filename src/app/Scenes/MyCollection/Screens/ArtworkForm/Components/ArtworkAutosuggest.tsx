import SearchIcon from "app/Icons/SearchIcon"
import { Flex, Input } from "palette"
import React, { useState } from "react"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkAutosuggestResultsQueryRenderer } from "./ArtworkAutosuggestResults"

interface ArtworkAutosuggestProps {
  onResultPress: (artworkId: string) => void
  onSkipPress: () => void
}

export const ArtworkAutosuggest: React.FC<ArtworkAutosuggestProps> = ({
  onResultPress,
  onSkipPress,
}) => {
  const { formik } = useArtworkForm()

  const { artistSearchResult } = formik.values
  const artistSlug = artistSearchResult?.slug || ""

  const [artworkQuery, setArtworkQuery] = useState("")

  // In order to get results even before the user types anything, we need to add the artist slug to the query.
  const keyword = artworkQuery.length < 2 ? `${artistSlug} ${artworkQuery}` : artworkQuery

  return (
    <>
      <Input
        placeholder="Search artworks"
        icon={<SearchIcon width={18} height={18} />}
        onChangeText={(value) => {
          setArtworkQuery(value)
        }}
        onBlur={formik.handleBlur("artwork")}
        value={artworkQuery}
        enableClearButton
        autoFocus={typeof jest === "undefined"}
      />

      {!!keyword.length && (
        <Flex height="100%" mb={2}>
          <ArtworkAutosuggestResultsQueryRenderer
            keyword={keyword}
            artistSlug={artistSlug}
            onPress={onResultPress}
            onSkipPress={onSkipPress}
          />
        </Flex>
      )}
    </>
  )
}
