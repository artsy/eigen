import { themeGet } from "@styled-system/theme-get"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { Button, Flex, Sans } from "palette"
import React from "react"
import styled from "styled-components/native"

export interface ZeroStateProps {
  id?: string
  slug?: string
  trackClear?: (id: string, slug: string) => void
  hideClearButton?: boolean
}

export const FilteredArtworkGridZeroState: React.FC<ZeroStateProps> = (props) => {
  const { id, slug, trackClear, hideClearButton } = props
  const clearFiltersZeroStateAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.clearFiltersZeroStateAction
  )

  return (
    <Flex flexDirection="column" px={4}>
      <ZeroStateMessage size="3">No results found{"\n"}Please try another search.</ZeroStateMessage>
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
    </Flex>
  )
}

const ZeroStateMessage = styled(Sans)`
  color: ${themeGet("colors.black100")};
  text-align: center;
`
