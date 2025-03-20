import { Flex, Box, SkeletonBox, SkeletonText } from "@artsy/palette-mobile"
import { times } from "lodash"

export const AlertsListPlaceholder: React.FC = () => {
  return (
    <>
      <Box py={1}>
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
