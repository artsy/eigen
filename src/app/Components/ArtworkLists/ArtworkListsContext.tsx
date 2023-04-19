import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { createContext, Dispatch, FC, useContext, useReducer, useState } from "react"

export enum SceneKey {
  SelectListsForArtwork,
  CreateNewList,
}

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
  currentSceneKey: SceneKey
  artwork: ArtworkEntity | null
  addingArtworkListIDs: string[]
  removingArtworkListIDs: string[]
  recentlyAddedArtworkList: RecentlyAddedArtworkList | null
}

export enum Mode {
  AddingArtworkListIDs = "addingArtworkListIDs",
  RemovingArtworkListIDs = "removingArtworkListIDs",
}

type Action =
  | { type: "SET_SCENE_KEY"; payload: SceneKey }
  | { type: "SET_RECENTLY_ADDED_ARTWORK_LIST"; payload: RecentlyAddedArtworkList | null }
  | { type: "SET_ARTWORK"; payload: ArtworkEntity | null }
  | { type: "RESET" }
  | {
      type: "ADD_OR_REMOVE_ARTWORK_LIST_ID"
      payload: { mode: Mode; artworkListID: string }
    }

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
  // Needed for testing purposes
  artwork?: ArtworkEntity
}

export const INITIAL_STATE: State = {
  currentSceneKey: SceneKey.SelectListsForArtwork,
  artwork: null,
  addingArtworkListIDs: [],
  removingArtworkListIDs: [],
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
  artwork,
}) => {
  const [isSavedToArtworkList, setIsSavedToArtworkList] = useState(!!artworkListId)
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    artwork: artwork ?? null,
  })
  const toast = useArtworkListToast()

  const onSave = (result: SaveResult) => {
    console.log("[debug] save result", result)

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

    if (result.action === ResultAction.SavedToDefaultArtworkList) {
      toast.savedToDefaultArtworkList()
    } else if (result.action === ResultAction.RemovedFromDefaultArtworkList) {
      toast.removedFromDefaultArtworkList()
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

  const renderSceneByKey = () => {
    if (state.currentSceneKey === SceneKey.CreateNewList) {
      console.log("[debug] render CreateNewList scene")

      return
    }

    console.log("[debug] render SelectListsForArtwork scene")
  }

  return (
    <ArtworkListsContext.Provider value={value}>
      {children}
      {!!state.artwork && renderSceneByKey()}
    </ArtworkListsContext.Provider>
  )
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SCENE_KEY":
      return {
        ...state,
        currentSceneKey: action.payload,
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
    case "SET_RECENTLY_ADDED_ARTWORK_LIST":
      return {
        ...state,
        recentlyAddedArtworkList: action.payload,
      }
    case "SET_ARTWORK":
      return {
        ...state,
        artwork: action.payload,
      }
    case "RESET":
      return INITIAL_STATE
    default:
      return state
  }
}
