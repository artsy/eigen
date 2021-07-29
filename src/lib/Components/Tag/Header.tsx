import { Header_tag } from "__generated__/Header_tag.graphql"
import { Box, Sans } from "palette"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface HeaderProps {
  tag: Header_tag
  relay: RelayProp
}

const Header: React.FC<HeaderProps> = ({ tag }) => {
  return (
    <Box marginTop={60} justifyContent="center">
      <Sans size="8" numberOfLines={2}>
        {tag.name || ""}
      </Sans>
    </Box>
  )
}

export default createFragmentContainer(Header, {
  tag: graphql`
    fragment Header_tag on Tag {
      internalID
      slug
      id
      name
    }
  `,
})
