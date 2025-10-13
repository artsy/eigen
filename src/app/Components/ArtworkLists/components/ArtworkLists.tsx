import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { ArtworkLists_me$data, ArtworkLists_me$key } from "__generated__/ArtworkLists_me.graphql"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ArtworkListsLoadingIndicator } from "app/Components/ArtworkLists/components/ArtworkListsLoadingIndicator"
import { ArtworkListMode, ArtworkListOfferSettingsMode } from "app/Components/ArtworkLists/types"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { FC, useCallback, useEffect } from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { ArtworkListItem, PressedArtworkListItem } from "./ArtworkListItem"

interface ArtworkListsProps {
  me: ArtworkLists_me$key | null
}

type ArtworkList =
  | NonNullable<ArtworkLists_me$data["savedArtworksArtworkList"]>
  | ExtractNodeType<ArtworkLists_me$data["customArtworkLists"]>

export const ArtworkLists: FC<ArtworkListsProps> = (props) => {
  const {
    shareArtworkListIDs,
    addingArtworkListIDs,
    removingArtworkListIDs,
    keepArtworkListPrivateIDs,
  } = ArtworkListsStore.useStoreState((state) => ({
    shareArtworkListIDs: state.shareArtworkListIDs,
    addingArtworkListIDs: state.addingArtworkListIDs,
    removingArtworkListIDs: state.removingArtworkListIDs,
    keepArtworkListPrivateIDs: state.keepArtworkListPrivateIDs,
  }))
  const { setSelectedTotalCount, shareOrKeepArtworkListPrivate, addOrRemoveArtworkList } =
    ArtworkListsStore.useStoreActions((actions) => ({
      setSelectedTotalCount: actions.setSelectedTotalCount,
      shareOrKeepArtworkListPrivate: actions.shareOrKeepArtworkListPrivate,
      addOrRemoveArtworkList: actions.addOrRemoveArtworkList,
    }))

  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
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
    setSelectedTotalCount(totalSelectedArtworkListsCount)
  }, [totalSelectedArtworkListsCount])

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

    return !!artworkList.isSavedArtwork
  }

  const checkIsArtworkListShared = (artworkList: ArtworkList) => {
    /**
     * User turned on the switch on the list to be shared with partners
     * So we have to display the artwork list as *shared*
     */
    if (shareArtworkListIDs.includes(artworkList.internalID)) {
      return true
    }

    /**
     * User turned on the switch on the list to be shared with partners
     * So we have to display the artwork list as *unselected*
     */
    if (keepArtworkListPrivateIDs.includes(artworkList.internalID)) {
      return false
    }

    return artworkList.shareableWithPartners
  }

  const handleArtworkListPress = useCallback((artworkList: PressedArtworkListItem) => {
    if (artworkList.shareableWithPartners !== undefined) {
      const mode = artworkList.shareableWithPartners
        ? ArtworkListOfferSettingsMode.KeepingArtworkListsPrivate
        : ArtworkListOfferSettingsMode.SharingArtworkLists

      shareOrKeepArtworkListPrivate({
        mode,
        artworkList: {
          internalID: artworkList.internalID,
          name: artworkList.name,
        },
      })
    } else {
      const mode = artworkList.isSavedArtwork
        ? ArtworkListMode.RemovingArtworkList
        : ArtworkListMode.AddingArtworkList

      addOrRemoveArtworkList({
        mode,
        artworkList: {
          internalID: artworkList.internalID,
          name: artworkList.name,
        },
      })
    }
  }, [])

  return (
    <BottomSheetFlatList
      data={artworkLists}
      keyExtractor={(item) => item.internalID}
      renderItem={({ item }) => {
        return (
          <ArtworkListItem
            item={item}
            selected={checkIsArtworkListSelected(item)}
            shareableWithPartners={checkIsArtworkListShared(item)}
            onPress={handleArtworkListPress}
          />
        )
      }}
      onEndReached={handleLoadMore}
      ListFooterComponent={() => <ArtworkListsLoadingIndicator visible={hasNext} />}
    />
  )
}

const ArtworkListsFragment = graphql`
  fragment ArtworkLists_me on Me
  @argumentDefinitions(
    artworkID: { type: "String!" }
    includeArtwork: { type: "Boolean", defaultValue: true }
    count: { type: "Int", defaultValue: 20 }
    after: { type: "String" }
  )
  @refetchable(queryName: "ArtworkLists_meRefetch") {
    savedArtworksArtworkList: collection(id: "saved-artwork") {
      internalID
      isSavedArtwork(artworkID: $artworkID) @include(if: $includeArtwork)
      shareableWithPartners
      ...ArtworkListItem_item @arguments(artworkID: $artworkID, includeArtwork: $includeArtwork)
    }

    customArtworkLists: collectionsConnection(
      first: $count
      after: $after
      default: false
      saves: true
      sort: UPDATED_AT_DESC
    ) @connection(key: "ArtworkLists_customArtworkLists", filters: []) {
      edges {
        node {
          internalID
          isSavedArtwork(artworkID: $artworkID) @include(if: $includeArtwork)
          shareableWithPartners
          ...ArtworkListItem_item @arguments(artworkID: $artworkID, includeArtwork: $includeArtwork)
        }
      }
    }

    artworkLists: collectionsConnection(first: 0, saves: true, includesArtworkID: $artworkID) {
      totalCount
    }
  }
`
