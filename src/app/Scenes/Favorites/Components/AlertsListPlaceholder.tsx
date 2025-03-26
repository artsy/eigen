import { Flex, Box, SkeletonBox, SkeletonText, ArrowDownIcon, Text } from "@artsy/palette-mobile"
import { times } from "lodash"

export const AlertsListPlaceholder: React.FC = () => {
  return (
    <>
      <Box>
        <Flex flexDirection="row" alignItems="center" mx={2} mt={2} mb={1}>
          <ArrowDownIcon />
          <Text ml={0.5}>Sort By</Text>
        </Flex>

        {times(20).map((index: number) => (
          <Box key={index} px={2} py={1} backgroundColor="white100">
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
