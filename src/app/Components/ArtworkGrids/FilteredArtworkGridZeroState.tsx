import { Flex, Text, Button } from "@artsy/palette-mobile"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"

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
    <Flex flexDirection="column" alignItems="center" px={4}>
      <Text textAlign="center" color="mono100" variant="sm">
        No results found{"\n"}Please try another search.
      </Text>
      <Flex pt={2}>
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
