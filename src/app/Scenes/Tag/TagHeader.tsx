import { TagHeader_tag$data } from "__generated__/TagHeader_tag.graphql"
import { Box, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface HeaderProps {
  tag: TagHeader_tag$data
  relay: RelayProp
}

const Header: React.FC<HeaderProps> = ({ tag }) => {
  return (
    <Box marginTop={60} justifyContent="center">
      <Text variant="lg">{tag.name}</Text>
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
