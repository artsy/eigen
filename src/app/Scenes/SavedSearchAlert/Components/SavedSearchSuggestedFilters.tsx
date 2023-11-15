import { ChevronIcon, Flex, Text } from "@artsy/palette-mobile"

export const SavedSearchSuggestedFilters: React.FC<{}> = () => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <Text color="blue" variant="xs">
        More Filters
      </Text>
      <ChevronIcon
        height={14}
        width={14}
        direction="right"
        fill="blue100"
        ml={0.5}
        // More filters has no characters that extend below the baseline,
        // adding one pixel here for more visually appealing vertical centering that matches the design
        top="1px"
      />
    </Flex>
  )
}
