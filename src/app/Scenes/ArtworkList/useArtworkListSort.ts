import { CollectionArtworkSorts } from "__generated__/ArtworkListQuery.graphql"
import { SortOption } from "app/Components/SortByModal/SortByModal"
import { useRef, useState } from "react"
import { FetchPolicy } from "relay-runtime"

export const SORT_OPTIONS: SortOption[] = [
  { value: "SAVED_AT_DESC", text: "Recently Added" },
  { value: "SAVED_AT_ASC", text: "First Added" },
]

export const DEFAULT_SORT_OPTION = SORT_OPTIONS[0].value as CollectionArtworkSorts

type RefetchFn = (
  variables: { sort?: CollectionArtworkSorts | null },
  options?: { fetchPolicy?: FetchPolicy }
) => unknown

export const useArtworkListSort = (refetch: RefetchFn) => {
  const [sortModalVisible, setSortModalVisible] = useState(false)
  const [selectedSortValue, setSelectedSortValue] = useState(DEFAULT_SORT_OPTION)

  // The sort modal reports its dismissal asynchronously, once its closing animation has finished,
  // so handleSortByModalClosed cannot rely on the selectedSortValue state closure: by then it
  // may be reading a value from a stale render. These refs track the sort the user actually picked
  // and the one we last fetched, so we always compare and refetch the current values.
  const selectedSortValueRef = useRef(DEFAULT_SORT_OPTION)
  const lastFetchedSortValueRef = useRef(DEFAULT_SORT_OPTION)

  const openSortModal = () => setSortModalVisible(true)

  const handleSortByModalClosed = () => {
    setSortModalVisible(false)

    const newSortValue = selectedSortValueRef.current

    if (newSortValue === lastFetchedSortValueRef.current) {
      return
    }

    lastFetchedSortValueRef.current = newSortValue
    refetch({ sort: newSortValue }, { fetchPolicy: "store-and-network" })
  }

  const handleSelectOption = (option: SortOption) => {
    selectedSortValueRef.current = option.value as CollectionArtworkSorts
    setSelectedSortValue(option.value as CollectionArtworkSorts)
    setSortModalVisible(false)
  }

  return {
    sortModalVisible,
    selectedSortValue,
    openSortModal,
    handleSortByModalClosed,
    handleSelectOption,
  }
}
