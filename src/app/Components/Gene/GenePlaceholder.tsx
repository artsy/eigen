import { Spacer } from "@artsy/palette-mobile"
import { PlaceholderGrid, PlaceholderText } from "app/utils/placeholders"
import { Flex, Separator } from "palette"

export const GenePlaceholder = () => (
  <Flex>
    <Flex px={2}>
      <Spacer y={75} />
      {/* Entity name */}
      <PlaceholderText width={150} />
      <Spacer y="1" />
      {/* Entity button */}
      <PlaceholderText />
    </Flex>
    <Spacer y="4" />
    {/* tabs */}
    <Flex justifyContent="space-around" flexDirection="row" px={2}>
      <PlaceholderText width={50} />
      <PlaceholderText width={50} />
    </Flex>
    <Spacer y="1" />
    <Separator />
    <Spacer y="2" />
    <Flex justifyContent="space-between" flexDirection="row" px={2}>
      <PlaceholderText width={180} />
      <PlaceholderText width={50} />
    </Flex>
    <Spacer y="2" />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)
