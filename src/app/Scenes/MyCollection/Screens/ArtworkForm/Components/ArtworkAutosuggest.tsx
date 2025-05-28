import { Flex, Input, Text, Touchable } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { useArtworkForm } from "app/Scenes/MyCollection/Screens/ArtworkForm/Form/useArtworkForm"
import React, { useState } from "react"
import { ArtworkAutosuggestResultsQueryRenderer } from "./ArtworkAutosuggestResults"

interface ArtworkAutosuggestProps {
  onResultPress: (artworkId: string) => void
  onSkipPress: (artworkTitle?: string) => void
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
  const trimmedArtworkQuery = artworkQuery.trimStart()
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
        value={trimmedArtworkQuery}
        enableClearButton
        autoFocus={typeof jest === "undefined"}
        autoCorrect={false}
      />

      {!!showSkipAheadToAddArtworkLink && (
        <Touchable
          accessibilityRole="button"
          onPress={() => onSkipPress?.(trimmedArtworkQuery)}
          testID="my-collection-artwork-form-artwork-skip-button"
        >
          <Flex flexDirection="row" my={1}>
            <Text variant="xs" color="mono60">
              Or skip ahead to{" "}
            </Text>

            <Text variant="xs" color="mono60" underline>
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
            setShowSkipAheadToAddArtworkLink={setShowSkipAheadToAddArtworkLink}
          />
        </Flex>
      )}
    </>
  )
}
