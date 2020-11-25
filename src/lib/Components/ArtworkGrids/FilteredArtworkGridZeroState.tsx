import { NewStore } from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { Button, color, Flex, Sans } from "palette"
import React, { useContext } from "react"
import styled from "styled-components/native"

interface ZeroStateProps {
  id: string
  slug: string
  trackClear: (id: string, slug: string) => void
}

export const FilteredArtworkGridZeroState: React.FC<ZeroStateProps> = (props) => {
  const { id, slug, trackClear } = props

  const clearFiltersZeroState = NewStore.useStoreActions((action) => action.clearFiltersZeroState)

  return (
    <Flex flexDirection="column" px={4}>
      <ZeroStateMessage size="3">Unfortunately, there are no works that meet your criteria.</ZeroStateMessage>
      <Flex m="0 auto" pt={2}>
        <Button
          size="medium"
          variant="secondaryGray"
          onPress={() => {
            trackClear(id, slug)
            clearFiltersZeroState({})
          }}
        >
          Clear filters
        </Button>
      </Flex>
    </Flex>
  )
}

const ZeroStateMessage = styled(Sans)`
  color: ${color("black100")};
  text-align: center;
`
