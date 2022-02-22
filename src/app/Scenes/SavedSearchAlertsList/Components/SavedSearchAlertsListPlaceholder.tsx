import { PlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { Box, Flex } from "palette"
import React from "react"

export const SavedSearchAlertsListPlaceholder: React.FC = () => {
  return (
    <>
      <Box py={1}>
        {times(20).map((index: number) => (
          <Flex key={index} m={1.5}>
            <PlaceholderText width={200 + Math.round(Math.random() * 100)} height={23} />
          </Flex>
        ))}
      </Box>
    </>
  )
}
