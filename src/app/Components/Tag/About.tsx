import { About_tag$data } from "__generated__/About_tag.graphql"
import { SystemDeviceInfo } from "app/system/SystemDeviceInfo"
import { Text } from "palette"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import removeMarkdown from "remove-markdown"
import { StickyTabPageScrollView } from "../StickyTabPage/StickyTabPageScrollView"

interface AboutProps {
  tag: About_tag$data
}

const sideMargin = SystemDeviceInfo.getDeviceType() === "Handset" ? 0 : 50

const About: React.FC<AboutProps> = ({ tag }) => {
  if (!tag.description) {
    return null
  }

  return (
    <StickyTabPageScrollView contentContainerStyle={{ paddingTop: 15 }}>
      <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
        <Text variant="sm" mb={2}>
          {removeMarkdown(tag.description)}
        </Text>
      </View>
    </StickyTabPageScrollView>
  )
}

export default createFragmentContainer(About, {
  tag: graphql`
    fragment About_tag on Tag {
      description
    }
  `,
})
