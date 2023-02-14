import { Box } from "@artsy/palette-mobile"
import { TagHeader_tag$data } from "__generated__/TagHeader_tag.graphql"
import { Text } from "palette"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface HeaderProps {
  tag: TagHeader_tag$data
  relay: RelayProp
}

const Header: React.FC<HeaderProps> = ({ tag }) => {
  return (
    <Box mt={6} justifyContent="center">
      <Text variant="lg-display">{tag.name}</Text>
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
