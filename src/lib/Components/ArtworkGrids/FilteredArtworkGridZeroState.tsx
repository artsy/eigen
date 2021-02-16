import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Button, color, Flex, Sans } from "palette"
import React, { useContext } from "react"
import styled from "styled-components/native"

interface ZeroStateProps {
  id: string
  slug: string
  trackClear?: (id: string, slug: string) => void
}

export const FilteredArtworkGridZeroState: React.FC<ZeroStateProps> = (props) => {
  const { id, slug, trackClear } = props
  const { dispatch } = useContext(ArtworkFilterContext)

  const refetchArtworks = () => {
    dispatch({ type: "clearFiltersZeroState" })
  }

  return (
    <Flex flexDirection="column" px={4}>
      <ZeroStateMessage size="3">No results found{"\n"}Please try another search.</ZeroStateMessage>
      <Flex m="0 auto" pt={2}>
        <Button
          size="medium"
          variant="secondaryGray"
          onPress={() => {
            if (trackClear) {
              trackClear(id, slug)
            }
            refetchArtworks()
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
