import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SavedItemRow from "lib/Components/Lists/SavedItemRow"

class Artists extends React.Component<RelayProps, null> {
  render() {
    const rows: any[] = this.props.me.follow_artists.artists
    return (
      <FlatList data={rows} keyExtractor={({ __id }) => __id} renderItem={item => <SavedItemRow {...item.item} />} />
    )
  }
}

export default createFragmentContainer(
  Artists,
  graphql`
    fragment Artists_me on Me {
      follow_artists {
        artists {
          id
          __id
          name
          href
          image {
            url
          }
        }
      }
    }
  `
)

interface RelayProps {
  me: {
    follow_artists: {
      artists: any[]
    } | null
  } | null
}
