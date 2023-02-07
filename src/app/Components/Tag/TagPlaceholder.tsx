import { Spacer } from "@artsy/palette-mobile"
import { PlaceholderGrid, PlaceholderText } from "app/utils/placeholders"
import { Flex, Separator } from "palette"

export const TagPlaceholder: React.FC = () => (
  <Flex>
    <Flex px={2}>
      {/* Entity name */}
      <PlaceholderText />
    </Flex>
    <Spacer y="1" />
    <Separator />
    <Spacer y="2" />
    {/* Filters */}
    <Flex justifyContent="space-between" flexDirection="row" px={2}>
      <PlaceholderText width={180} />
      <PlaceholderText width={50} />
    </Flex>
    <Spacer y="0.5" />
    {/* Grid */}
    <PlaceholderGrid />
  </Flex>
)
