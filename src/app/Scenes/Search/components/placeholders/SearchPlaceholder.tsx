import {
  PlaceholderBox,
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
} from "app/utils/placeholders"
import { times } from "lodash"
import { Box, Flex, Spacer } from "palette"
import React from "react"

export const SearchPlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Box p={2}>
        <PlaceholderBox height={46} />
        <Spacer mt={2} />
        <Spacer mt={1} />
        <PlaceholderText width="50%" height={20} />
        <Spacer mt={2} />
        {times(4).map((index) => (
          <Flex key={`search-placeholder-${index}`} flexDirection="row" mb={2}>
            <PlaceholderBox width={40} height={40} />
            <Flex flex={1} ml={1}>
              <PlaceholderRaggedText textHeight={15} numLines={2} />
            </Flex>
          </Flex>
        ))}
      </Box>
    </ProvidePlaceholderContext>
  )
}
