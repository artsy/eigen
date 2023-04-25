import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { CreateNewArtworkListView } from "app/Components/ArtworkLists/views/CreateNewArtworkListView"
import { SelectArtworkListsForArtworkView } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/SelectArtworkListsForArtworkView"
import { createContext, Dispatch, FC, useContext, useReducer, useState } from "react"

export enum ResultAction {
  SavedToDefaultArtworkList,
  RemovedFromDefaultArtworkList,
  ModifiedCustomArtworkLists,
}

export interface RecentlyAddedArtworkList {
  internalID: string
  name: string
}

type State = {
  createNewArtworkListViewVisible: boolean
  artwork: ArtworkEntity | null
  recentlyAddedArtworkList: RecentlyAddedArtworkList | null
  selectedArtworkListIDs: string[]
  addingArtworkListIDs: string[]
  removingArtworkListIDs: string[]
}

export enum ArtworkListMode {
  AddingArtworkListIDs = "addingArtworkListIDs",
  RemovingArtworkListIDs = "removingArtworkListIDs",
}

type Action =
  | { type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE"; payload: boolean }
  | { type: "SET_ARTWORK"; payload: ArtworkEntity | null }
  | { type: "SET_RECENTLY_ADDED_ARTWORK_LIST"; payload: RecentlyAddedArtworkList | null }
  | { type: "RESET" }
  | {
      type: "ADD_OR_REMOVE_ARTWORK_LIST_ID"
      payload: { mode: ArtworkListMode; artworkListID: string }
    }
  | { type: "SET_SELECTED_ARTWORK_LIST_IDS"; payload: string[] }

export interface ArtworkEntity {
  id: string
  internalID: string
  title: string
  year: string | null
  artistNames: string | null
  imageURL: string | null
}

export interface ResultArtworkListEntity {
  id: string
  name: string
}

export type DefaultArtworkListSaveResult = {
  action: ResultAction.SavedToDefaultArtworkList | ResultAction.RemovedFromDefaultArtworkList
}

export type CustomArtworkListsSaveResult = {
  action: ResultAction.ModifiedCustomArtworkLists
  artworkLists: {
    selected: ResultArtworkListEntity[]
    added: ResultArtworkListEntity[]
    removed: ResultArtworkListEntity[]
  }
}

export type SaveResult = DefaultArtworkListSaveResult | CustomArtworkListsSaveResult

export interface ArtworkListsContextState {
  state: State
  artworkListId?: string
  isSavedToArtworkList: boolean
  dispatch: Dispatch<Action>
  reset: () => void
  onSave: (result: SaveResult) => void
}

export interface ArtworkListsProviderProps {
  artworkListId?: string
  // Needs for tests
  artwork?: ArtworkEntity
}

export const INITIAL_STATE: State = {
  createNewArtworkListViewVisible: false,
  artwork: null,
  recentlyAddedArtworkList: null,
  selectedArtworkListIDs: [],
  addingArtworkListIDs: [],
  removingArtworkListIDs: [],
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
    ...INITIAL_STATE,
    artwork: artwork ?? null,
  })
  const toast = useArtworkListToast()

  const onSave = (result: SaveResult) => {
    if (artworkListId) {
      if (result.action !== ResultAction.ModifiedCustomArtworkLists) {
        throw new Error("You should pass `ModifiedCustomArtworkLists` action")
      }

      const { selected } = result.artworkLists
      const isSaved = selected.find((list) => list.id === artworkListId)

      setIsSavedToArtworkList(!!isSaved)
      toast.changesSaved()

      return
    }
  }

  const reset = () => {
    dispatch({
      type: "RESET",
    })
  }

  const value: ArtworkListsContextState = {
    state,
    artworkListId,
    isSavedToArtworkList,
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

const reducer = (state: State, action: Action): State => {
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
    case "ADD_OR_REMOVE_ARTWORK_LIST_ID":
      // eslint-disable-next-line no-case-declarations
      const { artworkListID, mode } = action.payload
      // eslint-disable-next-line no-case-declarations
      const ids = state[mode]

      if (ids.includes(artworkListID)) {
        return {
          ...state,
          [mode]: ids.filter((id) => id !== artworkListID),
        }
      }

      return {
        ...state,
        [mode]: [...ids, artworkListID],
      }
    case "SET_SELECTED_ARTWORK_LIST_IDS":
      return {
        ...state,
        selectedArtworkListIDs: action.payload,
      }
    case "RESET":
      return INITIAL_STATE
    default:
      return state
  }
}
