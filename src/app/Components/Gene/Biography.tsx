import { Text } from "@artsy/palette-mobile"
import { Biography_gene$data } from "__generated__/Biography_gene.graphql"
import { Dimensions, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import removeMarkdown from "remove-markdown"

const sideMargin = Dimensions.get("window").width > 700 ? 50 : 0

interface Props extends ViewStyle {
  gene: Biography_gene$data
}

const Biography: React.FC<Props> = ({ gene }) => {
  if (!gene.description) {
    return null
  }

  return (
    <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
      <Text variant="sm" color="black" mb={2}>
        {removeMarkdown(gene.description)}
      </Text>
    </View>
  )
}

export default createFragmentContainer(Biography, {
  gene: graphql`
    fragment Biography_gene on Gene {
      description
    }
  `,
})
