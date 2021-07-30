import { About_tag } from "__generated__/About_tag.graphql"
import { Sans } from "palette"
import React from "react"
import { View } from "react-native"
import DeviceInfo from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import removeMarkdown from "remove-markdown"

interface AboutProps {
  tag: About_tag
}

const sideMargin = DeviceInfo.getDeviceType() === "Handset" ? 0 : 50

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
