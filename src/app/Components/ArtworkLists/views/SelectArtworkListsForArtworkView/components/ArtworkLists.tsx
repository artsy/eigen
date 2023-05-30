import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { ArtworkLists_me$key, ArtworkLists_me$data } from "__generated__/ArtworkLists_me.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { FC, useEffect, useState } from "react"
import { usePaginationFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkListItem } from "./ArtworkListItem"
import { ArtworkListsLoadingIndicator } from "./ArtworkListsLoadingIndicator"

interface ArtworkListsProps {
  me: ArtworkLists_me$key | null
}

type ArtworkList =
  | NonNullable<ArtworkLists_me$data["savedArtworksArtworkList"]>
  | ExtractNodeType<ArtworkLists_me$data["savedArtworksArtworkList"]>

export const ArtworkLists: FC<ArtworkListsProps> = (props) => {
  const [refreshing, setRefreshing] = useState(false)
  const { addingArtworkListIDs, removingArtworkListIDs, dispatch } = useArtworkListsContext()
  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    ArtworkListsFragment,
    props.me
  )
  const savedArtworksArtworkList = data?.savedArtworksArtworkList
  const totalSelectedArtworkListsCount = data?.artworkLists?.totalCount ?? 0
  const customArtworkLists = extractNodes(data?.customArtworkLists)
  let artworkLists = customArtworkLists

  if (savedArtworksArtworkList) {
    artworkLists = [savedArtworksArtworkList, ...artworkLists]
  }

  useEffect(() => {
    dispatch({
      type: "SET_SELECTED_TOTAL_COUNT",
      payload: totalSelectedArtworkListsCount,
    })
  }, [totalSelectedArtworkListsCount])

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

  const checkIsArtworkListSelected = (artworkList: ArtworkList) => {
    /**
     * User added artwork to the previously unselected artwork list
     * So we have to display the artwork list as *selected*
     */
    if (addingArtworkListIDs.includes(artworkList.internalID)) {
      return true
    }

    /**
     * User deleted artwork from the previously selected artwork list
     * So we have to display the artwork list as *unselected*
     */
    if (removingArtworkListIDs.includes(artworkList.internalID)) {
      return false
    }

    return artworkList.isSavedArtwork
  }

  return (
    <BottomSheetFlatList
      data={artworkLists}
      keyExtractor={(item) => item.internalID}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => {
        return <ArtworkListItem item={item} selected={checkIsArtworkListSelected(item)} />
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
    ) @connection(key: "ArtworkLists_customArtworkLists", filters: []) {
      edges {
        node {
          internalID
          isSavedArtwork(artworkID: $artworkID)
          ...ArtworkListItem_item @arguments(artworkID: $artworkID)
        }
      }
    }

    artworkLists: collectionsConnection(first: 0, saves: true, includesArtworkID: $artworkID) {
      totalCount
    }
  }
`
