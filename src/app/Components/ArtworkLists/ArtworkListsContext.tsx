import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { ArtworkListEntity } from "app/Components/ArtworkLists/types"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { CreateNewArtworkListView } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/CreateNewArtworkListView"
import { SelectArtworkListsForArtworkView } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/SelectArtworkListsForArtworkView"
import { createContext, FC, useCallback, useContext, useReducer, useState } from "react"
import {
  ArtworkEntity,
  ArtworkListAction,
  ArtworkListsContextState,
  ArtworkListState,
  ResultAction,
  SaveResult,
} from "./types"

export interface ArtworkListsProviderProps {
  artworkListId?: string
  // Needs for tests
  artwork?: ArtworkEntity
}

export const ARTWORK_LISTS_CONTEXT_INITIAL_STATE: ArtworkListState = {
  createNewArtworkListViewVisible: false,
  artwork: null,
  recentlyAddedArtworkList: null,
  selectedArtworkListIDs: [],
  addingArtworkLists: [],
  removingArtworkLists: [],
}

export const ArtworkListsContext = createContext<ArtworkListsContextState>(
  null as unknown as ArtworkListsContextState
)

export const useArtworkListsContext = () => {
  return useContext(ArtworkListsContext)
}

/**
 *
 * If `artworkListId` was passed, it means the user is on the artwork lists page
 * In this case, whether the artwork is saved or not will depend on the local state (not on the status received from backend)
 */
export const ArtworkListsProvider: FC<ArtworkListsProviderProps> = ({
  children,
  artworkListId,
  artwork,
}) => {
  const [isSavedToArtworkList, setIsSavedToArtworkList] = useState(!!artworkListId)
  const [state, dispatch] = useReducer(reducer, {
    ...ARTWORK_LISTS_CONTEXT_INITIAL_STATE,
    artwork: artwork ?? null,
  })
  const toast = useArtworkListToast()

  const showToastForAddedLists = (artworkLists: ArtworkListEntity[]) => {
    if (artworkLists.length === 1) {
      toast.addedToSingleArtworkList(artworkLists[0])
      return
    }

    return toast.addedToMultipleArtworkLists(artworkLists)
  }

  const showToastForRemovedLists = (artworkLists: ArtworkListEntity[]) => {
    if (artworkLists.length === 1) {
      toast.removedFromSingleArtworkList(artworkLists[0])
      return
    }

    return toast.removedFromMultipleArtworkLists(artworkLists)
  }

  const modifiedArtworkLists = (
    addedArtworkLists: ArtworkListEntity[],
    removedArtworkLists: ArtworkListEntity[]
  ) => {
    if (addedArtworkLists.length > 0 && removedArtworkLists.length > 0) {
      toast.changesSaved()
      return
    }

    if (addedArtworkLists.length > 0) {
      showToastForAddedLists(addedArtworkLists)
      return
    }

    if (removedArtworkLists.length > 0) {
      showToastForRemovedLists(removedArtworkLists)
      return
    }
  }

  const savedToDefaultArtworkList = (artwork: ArtworkEntity) => {
    const openSelectArtworkListsForArtworkView = () => {
      dispatch({
        type: "SET_ARTWORK",
        payload: artwork,
      })
    }

    toast.savedToDefaultArtworkList(openSelectArtworkListsForArtworkView)
  }

  const onSave = (result: SaveResult) => {
    if (artworkListId) {
      if (result.action !== ResultAction.ModifiedArtworkLists) {
        throw new Error("You should pass `ModifiedArtworkLists` action")
      }

      const isArtworkListAdded = isArtworkListsIncludes(artworkListId, state.addingArtworkLists)
      const isArtworkListRemoved = isArtworkListsIncludes(artworkListId, state.removingArtworkLists)

      if (isArtworkListAdded) {
        setIsSavedToArtworkList(true)
      } else if (isArtworkListRemoved) {
        setIsSavedToArtworkList(false)
      }

      toast.changesSaved()

      return
    }

    if (result.action === ResultAction.SavedToDefaultArtworkList) {
      savedToDefaultArtworkList(result.artwork)
      return
    }

    if (result.action === ResultAction.RemovedFromDefaultArtworkList) {
      toast.removedFromDefaultArtworkList()
      return
    }

    if (result.action === ResultAction.ModifiedArtworkLists) {
      modifiedArtworkLists(state.addingArtworkLists, state.removingArtworkLists)
      return
    }

    throw new Error("Unexpected save result for artwork lists")
  }

  const reset = useCallback(() => {
    dispatch({
      type: "RESET",
    })
  }, [dispatch])

  const addingArtworkListIDs = state.addingArtworkLists.map((entity) => entity.internalID)
  const removingArtworkListIDs = state.removingArtworkLists.map((entity) => entity.internalID)
  const value: ArtworkListsContextState = {
    state,
    artworkListId,
    isSavedToArtworkList,
    addingArtworkListIDs,
    removingArtworkListIDs,
    dispatch,
    reset,
    onSave,
  }

  return (
    <ArtworkListsContext.Provider value={value}>
      <BottomSheetModalProvider>
        {children}

        {!!state.artwork && (
          <>
            <SelectArtworkListsForArtworkView />
            {state.createNewArtworkListViewVisible && <CreateNewArtworkListView />}
          </>
        )}
      </BottomSheetModalProvider>
    </ArtworkListsContext.Provider>
  )
}

const reducer = (state: ArtworkListState, action: ArtworkListAction): ArtworkListState => {
  switch (action.type) {
    case "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE":
      return {
        ...state,
        createNewArtworkListViewVisible: action.payload,
      }
    case "SET_ARTWORK":
      return {
        ...state,
        artwork: action.payload,
      }
    case "SET_RECENTLY_ADDED_ARTWORK_LIST":
      return {
        ...state,
        recentlyAddedArtworkList: action.payload,
      }
    case "ADD_OR_REMOVE_ARTWORK_LIST":
      // eslint-disable-next-line no-case-declarations
      const { artworkList, mode } = action.payload
      // eslint-disable-next-line no-case-declarations
      const artworkLists = state[mode]
      // eslint-disable-next-line no-case-declarations
      const ids = artworkLists.map((artworkList) => artworkList.internalID)

      if (ids.includes(artworkList.internalID)) {
        return {
          ...state,
          [mode]: artworkLists.filter((entity) => entity.internalID !== artworkList.internalID),
        }
      }

      return {
        ...state,
        [mode]: [...artworkLists, artworkList],
      }
    case "SET_SELECTED_ARTWORK_LIST_IDS":
      return {
        ...state,
        selectedArtworkListIDs: action.payload,
      }
    case "RESET":
      return ARTWORK_LISTS_CONTEXT_INITIAL_STATE
    default:
      return state
  }
}

const isArtworkListsIncludes = (artworkListID: string, artworkLists: ArtworkListEntity[]) => {
  return artworkLists.find((artworkList) => artworkList.internalID === artworkListID)
}
