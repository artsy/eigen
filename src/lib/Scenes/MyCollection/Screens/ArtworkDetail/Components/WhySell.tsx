import { Box, Flex, Sans } from "palette"
import React from "react"

export const WhySellStep: React.FC<{ step: number; title: string; description: string }> = ({
  step,
  title,
  description,
}) => {
  return (
    <Flex flexDirection="row">
      <Box mr={2}>
        <Sans size="3">{step}</Sans>
      </Box>
      <Box>
        <Sans size="3">{title}</Sans>
        <Sans size="3" color="black60">
          {description}
        </Sans>
      </Box>
    </Flex>
  )
}
