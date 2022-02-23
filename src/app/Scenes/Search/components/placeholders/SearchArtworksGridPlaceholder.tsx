import { PlaceholderButton, PlaceholderGrid } from "app/utils/placeholders"
import { Flex, Separator } from "palette"
import React from "react"

export const SearchArtworksGridPlaceholder: React.FC = () => (
  <Flex accessibilityLabel="Artwork results are loading">
    <Flex height={28} my={1} px={2} justifyContent="space-between">
      <Flex flex={1} flexDirection="row">
        <PlaceholderButton width={20} height={20} />
        <PlaceholderButton marginLeft={5} width={70} height={20} />
      </Flex>
    </Flex>
    <Separator mb={2} />
    <PlaceholderGrid />
  </Flex>
)
