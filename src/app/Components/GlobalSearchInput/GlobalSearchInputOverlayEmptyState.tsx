import { SearchIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"

export const GlobalSearchInputOverlayEmptyState = () => {
  return (
    <Flex>
      <Flex alignItems="center" mt={6} mb={1}>
        <SearchIcon
          fill="mono100"
          width={48}
          height={52}
          style={{
            transform: [
              {
                scaleX: -1,
              },
            ],
          }}
        />
      </Flex>
      <Text selectable={false} variant="lg-display" textAlign="center">
        Find the art you love
      </Text>
      <Text selectable={false} variant="sm" textAlign="center" mt={1} color="mono60">
        Search for artists, artworks, galleries, and more. Save for later or add alerts.
      </Text>
    </Flex>
  )
}
