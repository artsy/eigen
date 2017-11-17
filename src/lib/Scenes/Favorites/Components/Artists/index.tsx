import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SavedArtistRow from "./Components/SavedArtistRow"

class Artists extends React.Component<any, any> {
  renderRow(item) {
    return <SavedArtistRow artist={item.item} />
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
          ...SavedArtistRow_artist
        }
      }
    }
  `
)
