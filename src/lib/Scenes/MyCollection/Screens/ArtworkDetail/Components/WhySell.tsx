import { Box, Flex, Text } from "palette"
import React from "react"

export const WhySellStep: React.FC<{ step: number; title: string; description: string }> = ({
  step,
  title,
  description,
}) => {
  return (
    <Flex flexDirection="row">
      <Box mr={2}>
        <Text>{step}</Text>
      </Box>
      <Box>
        <Text>{title}</Text>
        <Text color="black60">{description}</Text>
      </Box>
    </Flex>
  )
}
