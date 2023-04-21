import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { CreateNewArtworkListView } from "app/Components/ArtworkLists/views/CreateNewArtworkListView"
import { SelectArtworkListsForArtworkView } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView"
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
}

type Action =
  | { type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE"; payload: boolean }
  | { type: "SET_ARTWORK"; payload: ArtworkEntity | null }
  | { type: "SET_RECENTLY_ADDED_ARTWORK_LIST"; payload: RecentlyAddedArtworkList | null }
  | { type: "RESET" }

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

interface ArtworkListsProviderProps {
  artworkListId?: string
}

export const INITIAL_STATE: State = {
  createNewArtworkListViewVisible: false,
  artwork: null,
  recentlyAddedArtworkList: null,
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
}) => {
  const [isSavedToArtworkList, setIsSavedToArtworkList] = useState(!!artworkListId)
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
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
    case "RESET":
      return INITIAL_STATE
    default:
      return state
  }
}
