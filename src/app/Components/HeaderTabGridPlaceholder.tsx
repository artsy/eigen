import { Spacer, Flex } from "@artsy/palette-mobile"
import { PlaceholderGrid, PlaceholderText } from "app/utils/placeholders"
import { Separator } from "palette"

export const HeaderTabsGridPlaceholder: React.FC = () => {
  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px={2}>
        <Flex>
          <Spacer y="75px" />
          {/* Entity name */}
          <PlaceholderText width={180} />
          <Spacer y={1} />
          {/* subtitle text */}
          <PlaceholderText width={100} />
          {/* more subtitle text */}
          <PlaceholderText width={150} />
        </Flex>
        <PlaceholderText width={70} alignSelf="flex-end" />
      </Flex>
      <Spacer y={4} />
      {/* tabs */}
      <Flex justifyContent="space-around" flexDirection="row" px={2}>
        <PlaceholderText width={40} />
        <PlaceholderText width={50} />
        <PlaceholderText width={40} />
      </Flex>
      <Spacer y={1} />
      <Separator />
      <Spacer y={4} />
      {/* masonry grid */}
      <PlaceholderGrid />
    </Flex>
  )
}
