import { Flex } from "palette"
import React from "react"

interface ArtworkProps {
  artwork: any
}

export const ArtworkDetails: React.FC<ArtworkProps> = (props) => {
  console.log(props)
  return <Flex></Flex>
}
