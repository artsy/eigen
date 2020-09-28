import { SaleArtworkList_me } from "__generated__/SaleArtworkList_me.graphql"
import Spinner from "lib/Components/Spinner"
import { ZeroState } from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import { Spacer } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { extractNodes } from "../../../utils/extractNodes"
import { SaleArtworkListItemContainer as SaleArtworkListItem } from "./SaleArtworkListItem"

interface Props {
  me: SaleArtworkList_me
  relay: RelayPaginationProp
}

export const SaleArtworkList: React.FC<Props> = ({ me, relay }) => {
  const [loadingMoreData, setLoadingMoreData] = useState(false)

  const loadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    setLoadingMoreData(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }
      setLoadingMoreData(false)
    })
  }

  const artworks = extractNodes(me.lotsByFollowedArtistsConnection)

  return (
    <FlatList
      data={artworks}
      onEndReached={loadMore}
      ItemSeparatorComponent={() => <Spacer mb="20px" />}
      ListFooterComponent={loadingMoreData ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null}
      renderItem={({ item }) => <SaleArtworkListItem artwork={item} />}
      keyExtractor={(item) => item.internalID}
      style={{ paddingHorizontal: 20 }}
      ListEmptyComponent={() => (
        <ZeroState
          title="You haven’t followed any artists yet"
          subtitle="When you’ve found an artist you like, follow them to get updates on new works that become available."
        />
      )}
    />
  )
}

export const SaleArtworkListContainer = createPaginationContainer(
  SaleArtworkList,
  {
    me: graphql`
      fragment SaleArtworkList_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        lotsByFollowedArtistsConnection(first: $count, after: $cursor, liveSale: true, isAuction: true)
        @connection(key: "SaleArtworkList_lotsByFollowedArtistsConnection") {
          edges {
            cursor
            node {
              internalID
              ...SaleArtworkListItem_artwork
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ me }) => me && me.lotsByFollowedArtistsConnection,
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: graphql`
      query SaleArtworkListQuery($count: Int!, $cursor: String) {
        me {
          ...SaleArtworkList_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
