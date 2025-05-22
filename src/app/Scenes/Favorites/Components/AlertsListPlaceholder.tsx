import { Flex, Box, SkeletonBox, SkeletonText, Text, SortIcon } from "@artsy/palette-mobile"
import { times } from "lodash"

export const AlertsListPlaceholder: React.FC = () => {
  return (
    <>
      <Box>
        <Flex flexDirection="row" alignItems="center" mx={2}>
          <SortIcon />
          <Text variant="xs" ml={0.5}>
            Sort By
          </Text>
        </Flex>

        {times(10).map((index: number) => (
          <Box key={index} px={2} py={1} backgroundColor="mono0">
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-start">
              <Flex mr={1}>
                <SkeletonBox width={60} height={60} />
              </Flex>
              <Flex flex={1} flexDirection="column">
                <SkeletonText variant="sm" mb={1}>
                  Damon Zucconi
                </SkeletonText>
                <SkeletonText variant="sm">Collage or other Work on Paper</SkeletonText>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Box>
    </>
  )
}
