import { Button, color, Flex, Sans } from "@artsy/palette"
import { ArtworkFilterContext } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import styled from "styled-components/native"

interface ZeroStateProps {
  id: string
  slug: string
  trackClear: (id: string, slug: string) => void
}

export const FilteredArtworkGridZeroState: React.SFC<ZeroStateProps> = props => {
  const { id, slug, trackClear } = props
  const { dispatch } = useContext(ArtworkFilterContext)

  const refetchArtworks = () => {
    dispatch({ type: "clearFiltersZeroState" })
  }

  return (
    <ZeroStateContainer>
      <ZeroStateMessage size="3">Unfortunately, there are no works that meet your criteria.</ZeroStateMessage>
      <ButtonBox>
        <Button
          size="medium"
          variant="secondaryGray"
          onPress={() => {
            trackClear(id, slug)
            refetchArtworks()
          }}
        >
          Clear filters
        </Button>
      </ButtonBox>
    </ZeroStateContainer>
  )
}

const ZeroStateMessage = styled(Sans)`
  color: ${color("black100")};
  text-align: center;
`
const ZeroStateContainer = styled(Flex)`
  padding: 25px 35px 50px 35px;
  flex-direction: column;
`

const ButtonBox = styled(Flex)`
  margin: 0 auto;
  padding: 15px 0 25px 0;
`
