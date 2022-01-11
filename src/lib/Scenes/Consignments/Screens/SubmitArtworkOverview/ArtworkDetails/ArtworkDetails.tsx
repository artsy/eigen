import { Flex, Text } from "palette"
import React from "react"

interface ArtworkDetailsProps {
  // TODO
  handlePress: any
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({}) => {
  return (
    <Flex p={1} mt={1}>
      <Text variant="sm" color="black60">
        · All fields are required to submit an artwork.
      </Text>
    </Flex>
  )
}
