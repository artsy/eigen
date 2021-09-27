import { ArrowRightIcon, Box, Flex } from "palette"
import React from "react"

export const ArrowDetails: React.FC = ({ children }) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" width="100%" alignItems="center">
      <Box>{children}</Box>
      <ArrowRightIcon />
    </Flex>
  )
}
