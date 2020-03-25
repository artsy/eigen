import { Box, Flex } from "@artsy/palette"
import React from "react"
import { Image } from "react-native"

interface ViewingRoomHeaderProps {
  artwork: string
}

export class ViewingRoomHeader extends React.Component<ViewingRoomHeaderProps> {
  render() {
    const { artwork } = this.props
    return (
      <Box>
        <Flex alignItems="center" mt={2}>
          <Image source={{ uri: artwork }} style={{ height: 600, width: 600 }} />
        </Flex>
      </Box>
    )
  }
}
