import { TagHeader_tag } from "__generated__/TagHeader_tag.graphql"
import { Box, Text } from "palette"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface HeaderProps {
  tag: TagHeader_tag
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
