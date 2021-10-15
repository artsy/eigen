import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Box, Button, Flex, Text } from "palette"
import React from "react"

type ResultsType = "search" | "filter"

interface ZeroStateProps {
  id?: string
  slug?: string
  trackClear?: (id: string, slug: string) => void
  hideClearButton?: boolean
  resultsType?: ResultsType
}

const ZeroStateMessage: React.FC<{ resultsType: ResultsType }> = ({ resultsType }) => {
  if (resultsType === "search") {
    return (
      <Box px={2}>
        <Text variant="md">No results were found.</Text>
        <Text variant="md" color="black60">
          Please try another search term.
        </Text>
      </Box>
    )
  }

  return (
    <Text variant="sm" color="black100" textAlign="center">
      No results found{"\n"}Please try another search.
    </Text>
  )
}

export const FilteredArtworkGridZeroState: React.FC<ZeroStateProps> = (props) => {
  const { id, slug, trackClear, hideClearButton, resultsType = "filter" } = props
  const clearFiltersZeroStateAction = ArtworksFiltersStore.useStoreActions((state) => state.clearFiltersZeroStateAction)

  return (
    <>
      <ZeroStateMessage resultsType={resultsType} />

      <Flex m="0 auto" pt={2}>
        {!hideClearButton && (
          <Button
            size="small"
            variant="fillGray"
            onPress={() => {
              if (!!id && !!slug && trackClear) {
                trackClear(id, slug)
              }
              clearFiltersZeroStateAction()
            }}
          >
            Clear filters
          </Button>
        )}
      </Flex>
    </>
  )
}
