import { Header_tag } from "__generated__/Header_tag.graphql"
import { Box, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface HeaderProps {
  tag: Header_tag
  relay: RelayProp
}

const Header: React.FC<HeaderProps> = ({ tag }) => {
  return (
    <Box marginTop={60} justifyContent="center">
      <Text variant="largeTitle">{tag.name}</Text>
    </Box>
  )
}

export default createFragmentContainer(Header, {
  tag: graphql`
    fragment TagHeader_tag on Tag {
      name
    }
  `,
})
