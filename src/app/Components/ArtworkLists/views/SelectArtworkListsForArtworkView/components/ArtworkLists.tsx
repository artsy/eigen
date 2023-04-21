import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { ArtworkLists_me$key } from "__generated__/ArtworkLists_me.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { getSelectedArtworkListIds } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/utils/getSelectedArtworkListIds"
import { extractNodes } from "app/utils/extractNodes"
import { FC, useEffect, useMemo, useState } from "react"
import { usePaginationFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkListItem } from "./ArtworkListItem"
import { ArtworkListsLoadingIndicator } from "./ArtworkListsLoadingIndicator"

interface ArtworkListsProps {
  me: ArtworkLists_me$key | null
}

export const ArtworkLists: FC<ArtworkListsProps> = (props) => {
  const [refreshing, setRefreshing] = useState(false)
  const { state, dispatch } = useArtworkListsContext()
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    ArtworkListsFragment,
    props.me
  )
  const savedArtworksArtworkList = data?.savedArtworksArtworkList
  const customArtworkLists = extractNodes(data?.customArtworkLists)
  let artworkLists = customArtworkLists

  if (savedArtworksArtworkList) {
    artworkLists = [savedArtworksArtworkList, ...artworkLists]
  }

  const selectedArtworkListIds = useMemo(() => {
    return getSelectedArtworkListIds({
      artworkLists,
      addToArtworkListIDs: state.addingArtworkListIDs,
      removeFromArtworkListIDs: state.removingArtworkListIDs,
    })
  }, [state.addingArtworkListIDs, state.removingArtworkListIDs, artworkLists.length])

  useEffect(() => {
    dispatch({
      type: "SET_SELECTED_ARTWORK_LIST_IDS",
      payload: selectedArtworkListIds,
    })
  }, [selectedArtworkListIds, dispatch])

  const handleRefresh = () => {
    setRefreshing(true)
    refetch(
      {},
      {
        fetchPolicy: "store-and-network",
        onComplete: () => {
          setRefreshing(false)
        },
      }
    )
  }

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(10)
  }

  return (
    <BottomSheetFlatList
      data={artworkLists}
      keyExtractor={(item) => item.internalID}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => {
        return <ArtworkListItem item={item} />
      }}
      onEndReached={handleLoadMore}
      ListFooterComponent={<ArtworkListsLoadingIndicator visible={hasNext} />}
    />
  )
}

const ArtworkListsFragment = graphql`
  fragment ArtworkLists_me on Me
  @argumentDefinitions(
    artworkID: { type: "String!" }
    count: { type: "Int", defaultValue: 20 }
    after: { type: "String" }
  )
  @refetchable(queryName: "ArtworkLists_meRefetch") {
    savedArtworksArtworkList: collection(id: "saved-artwork") {
      internalID
      isSavedArtwork(artworkID: $artworkID)
      ...ArtworkListItem_item @arguments(artworkID: $artworkID)
    }

    customArtworkLists: collectionsConnection(
      first: $count
      after: $after
      default: false
      saves: true
      sort: CREATED_AT_DESC
    ) @connection(key: "ArtworkLists_customArtworkLists") {
      edges {
        node {
          internalID
          isSavedArtwork(artworkID: $artworkID)
          ...ArtworkListItem_item @arguments(artworkID: $artworkID)
        }
      }
    }
  }
`
