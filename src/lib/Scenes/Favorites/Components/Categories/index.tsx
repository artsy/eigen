import React from "react"
import { FlatList, Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SavedArtistRow from "../Artists/Components/SavedArtistRow"

class Artists extends React.Component<RelayProps, null> {
  renderRow(item) {
    return (
      <Text>
        {item.id}
      </Text>
    )
  }

  render() {
    const rows: any[] = this.props.me.followed_genes.edges.map(edge => edge.node)
    return <FlatList data={rows} keyExtractor={({ __id }) => __id} renderItem={this.renderRow.bind(this)} />
  }
}

export default createFragmentContainer(
  Artists,
  graphql`
    fragment Categories_me on Me {
      followed_genes {
        edges {
          node {
            id
            __id
          }
        }
      }
    }
  `
)

interface RelayProps {
  me: {
    followed_genes: {
      edges: any[] | null
    } | null
  } | null
}
