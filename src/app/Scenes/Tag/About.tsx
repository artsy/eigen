import { Flex, Tabs, Text } from "@artsy/palette-mobile"
import { About_tag$data } from "__generated__/About_tag.graphql"
import { createFragmentContainer, graphql } from "react-relay"
import removeMarkdown from "remove-markdown"

interface AboutProps {
  tag: About_tag$data
}

const About: React.FC<AboutProps> = ({ tag }) => {
  if (!tag.description) {
    return null
  }

  return (
    <Tabs.ScrollView>
      <Flex flex={1} alignItems="center" pt={2}>
        <Text variant="sm">{removeMarkdown(tag.description)}</Text>
      </Flex>
    </Tabs.ScrollView>
  )
}

export default createFragmentContainer(About, {
  tag: graphql`
    fragment About_tag on Tag {
      description
    }
  `,
})
