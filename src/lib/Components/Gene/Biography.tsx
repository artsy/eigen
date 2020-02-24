import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import removeMarkdown from "remove-markdown"

import { Dimensions, StyleSheet, View, ViewProperties } from "react-native"

import SerifText from "../Text/Serif"

import { Biography_gene } from "__generated__/Biography_gene.graphql"

const sideMargin = Dimensions.get("window").width > 700 ? 50 : 0

interface Props extends ViewProperties {
  gene: Biography_gene
}

class Biography extends React.Component<Props> {
  render() {
    const gene = this.props.gene
    if (!gene.description) {
      return null
    }

    return <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>{this.blurb(gene)}</View>
  }

  blurb(gene) {
    if (gene.description) {
      return (
        <SerifText style={styles.blurb} numberOfLines={0}>
          {removeMarkdown(gene.description)}
        </SerifText>
      )
    }
  }
}

const styles = StyleSheet.create({
  blurb: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 20,
  },
  bio: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 40,
  },
})

export default createFragmentContainer(Biography, {
  gene: graphql`
    fragment Biography_gene on Gene {
      description
    }
  `,
})
