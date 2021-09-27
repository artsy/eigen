import { PlaceholderBox, RandomWidthPlaceholderText } from "lib/utils/placeholders"
import { times } from "lodash"
import { Box, Flex } from "palette"
import React from "react"

const IMAGE_SIZE = 40

export const AlgoliaSearchPlaceholder: React.FC = () => {
  return (
    <>
      <Box py={1} px={2}>
        {times(20).map((index) => (
          <Flex key={`algolia-search-placeholder-${index}`} flexDirection="row" my={1}>
            <PlaceholderBox width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius={IMAGE_SIZE / 2} />
            <Flex flex={1} justifyContent="center" ml={1}>
              <RandomWidthPlaceholderText minWidth={100} maxWidth={200} height={14} marginBottom={0} />
            </Flex>
          </Flex>
        ))}
      </Box>
    </>
  )
}
