import { Flex, MagnifyingGlassIcon, Text } from "@artsy/palette-mobile"

export const GlobalSearchInputOverlayEmptyState = () => {
  return (
    <Flex>
      <Flex alignItems="center" mt={6} mb={1}>
        <MagnifyingGlassIcon
          fill="black100"
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
      <Text variant="lg-display" textAlign="center">
        Find the art you love
      </Text>
      <Text variant="sm-display" textAlign="center" mt={1} color="black60">
        Search for artists, artworks, galleries, and more. Save for later or add alerts.
      </Text>
    </Flex>
  )
}
