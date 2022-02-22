import { PlaceholderBox, RandomWidthPlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { Box, Flex } from "palette"
import React from "react"
import { IMAGE_SIZE } from "../SearchResultImage"

interface AlgoliaSearchPlaceholderProps {
  hasRoundedImages: boolean
}

export const AlgoliaSearchPlaceholder: React.FC<AlgoliaSearchPlaceholderProps> = ({
  hasRoundedImages,
}) => {
  return (
    <>
      <Box px={2}>
        {times(20).map((index) => (
          <Flex key={`algolia-search-placeholder-${index}`} flexDirection="row" my={1}>
            <PlaceholderBox
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              borderRadius={hasRoundedImages ? IMAGE_SIZE / 2 : 0}
            />
            <Flex flex={1} justifyContent="center" ml={1}>
              <RandomWidthPlaceholderText
                minWidth={100}
                maxWidth={200}
                height={14}
                marginBottom={0}
              />
            </Flex>
          </Flex>
        ))}
      </Box>
    </>
  )
}
