import SearchIcon from "app/Icons/SearchIcon"
import { Flex, Input, Text, Touchable } from "palette"
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
  const [showSkipAheadToAddArtworkLink, setShowSkipAheadToAddArtworkLink] = useState(false)

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

      {showSkipAheadToAddArtworkLink && (
        <Touchable onPress={onSkipPress}>
          <Flex flexDirection="row" my={1}>
            <Text variant="xs" color="black60">
              Or skip ahead to{" "}
            </Text>

            <Text variant="xs" color="black60" underline>
              add artwork details
            </Text>
          </Flex>
        </Touchable>
      )}

      {!!keyword.length && (
        <Flex height="100%" mb={2}>
          <ArtworkAutosuggestResultsQueryRenderer
            keyword={keyword}
            artistSlug={artistSlug}
            onPress={onResultPress}
            onSkipPress={onSkipPress}
            setShowSkipAheadToAddArtworkLink={setShowSkipAheadToAddArtworkLink}
          />
        </Flex>
      )}
    </>
  )
}
