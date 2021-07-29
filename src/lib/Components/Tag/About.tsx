import { About_tag } from "__generated__/About_tag.graphql"
import { Sans } from "palette"
import React from "react"
import { Dimensions, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import removeMarkdown from "remove-markdown"

interface AboutProps {
  tag: About_tag
}

const sideMargin = Dimensions.get("window").width > 700 ? 50 : 0

const About: React.FC<AboutProps> = ({ tag }) => {
  if (!tag.description) {
    return null
  }

  return (
    <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
      <Sans size="3" color="black" mb={2}>
        {removeMarkdown(tag.description)}
      </Sans>
    </View>
  )
}

export default createFragmentContainer(About, {
  tag: graphql`
    fragment About_tag on Tag {
      description
    }
  `,
})
