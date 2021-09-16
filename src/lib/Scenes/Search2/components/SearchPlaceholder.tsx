import { getRandomIntInclusive } from "lib/utils/getRandomInt"
import { PlaceholderText } from "lib/utils/placeholders"
import { times } from "lodash"
import { Box, Flex, Spacer } from "palette"
import React from "react"

const placeholderSizes = times(20).map(() => ({
  title: `${getRandomIntInclusive(30, 60)}%`,
  description: `${getRandomIntInclusive(30, 60)}%`,
}))

export const SearchPlaceholder: React.FC = () => {
  return (
    <>
      <Box p={2}>
        <PlaceholderText height={42} />
        <Spacer mt={2} />
        <PlaceholderText width="50%" height={20} />
        <Spacer mt={2} />
        {placeholderSizes.map((size, index) => (
          <Flex flexDirection="row" key={index} mb={2}>
            <PlaceholderText width={40} height={40} />
            <Flex flex={1} ml={1} justifyContent="space-between">
              <PlaceholderText width={size.title} height={16} />
              <PlaceholderText width={size.description} height={16} />
            </Flex>
          </Flex>
        ))}
      </Box>
    </>
  )
}
