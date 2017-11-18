import React from "react"
import { FlatList, Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SavedItemRow from "lib/Components/Lists/SavedItemRow"
import ZeroState from "lib/Components/States/ZeroState"

export class Categories extends React.Component<RelayProps, null> {
  render() {
    const rows: any[] = this.props.me.followed_genes.edges.map(edge => edge.node.gene)
    const EmptyState = (
      <ZeroState
        title="You’re not following any categories yet"
        subtitle="Find a few categories to help improve your artwork recommendations."
      />
    )

    const CategoriesList = (
      <FlatList
        data={rows}
        keyExtractor={({ __id }) => __id}
        renderItem={data => <SavedItemRow square_image {...data.item} />}
      />
    )

    return rows.length ? CategoriesList : EmptyState
  }
}

export default createFragmentContainer(
  Categories,
  graphql`
    fragment Categories_me on Me {
      followed_genes(first: 10) {
        edges {
          node {
            gene {
              id
              __id
              name
              href
              id
              image {
                url
              }
            }
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
