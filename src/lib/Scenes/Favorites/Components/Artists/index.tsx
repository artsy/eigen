import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SavedItemRow from "lib/Components/Lists/SavedItemRow"
import ZeroState from "lib/Components/States/ZeroState"

class Artists extends React.Component<RelayProps, null> {
  render() {
    const rows: any[] = this.props.me.follow_artists.artists
    const EmptyState = (
      <ZeroState
        title="You haven’t followed any artists yet"
        subtitle="When you’ve found an artist you like, follow them to get updates on new works that become available."
      />
    )

    const ArtistsList = (
      <FlatList data={rows} keyExtractor={({ __id }) => __id} renderItem={item => <SavedItemRow {...item.item} />} />
    )

    return rows.length ? ArtistsList : EmptyState
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
