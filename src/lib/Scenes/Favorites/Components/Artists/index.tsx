import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SavedArtistRow from "./Components/SavedArtistRow"

class Artists extends React.Component<RelayProps, null> {
  renderRow(item) {
    console.log(item)
    return <SavedArtistRow {...item.item} />
  }

  render() {
    const rows: any[] = this.props.me.follow_artists.artists
    return <FlatList data={rows} keyExtractor={({ __id }) => __id} renderItem={this.renderRow.bind(this)} />
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
