import React from "react"
import { Dimensions, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import removeMarkdown from "remove-markdown"

import { Biography_gene } from "__generated__/Biography_gene.graphql"
import { Sans } from "palette"

const sideMargin = Dimensions.get("window").width > 700 ? 50 : 0

interface Props extends ViewStyle {
  gene: Biography_gene
}

const Biography: React.FC<Props> = ({ gene }) => {
  if (!gene.description) {
    return null
  }

  return (
    <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
      <Sans size="3" color="black" mb={2}>
        {removeMarkdown(gene.description)}
      </Sans>
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
