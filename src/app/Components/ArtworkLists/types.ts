import { Dispatch } from "react"

export interface RecentlyAddedArtworkList {
  internalID: string
  name: string
}

export enum ResultAction {
  SavedToDefaultArtworkList,
  RemovedFromDefaultArtworkList,
  ModifiedArtworkLists,
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

type DefaultArtworkListSaveResult =
  | {
      action: ResultAction.SavedToDefaultArtworkList
      artwork: ArtworkEntity
    }
  | {
      action: ResultAction.RemovedFromDefaultArtworkList
    }

export interface ModifiedArtworkLists {
  selected: ResultArtworkListEntity[]
  added: ResultArtworkListEntity[]
  removed: ResultArtworkListEntity[]
}

type CustomArtworkListsSaveResult = {
  action: ResultAction.ModifiedArtworkLists
  artworkLists: ModifiedArtworkLists
}

export type SaveResult = DefaultArtworkListSaveResult | CustomArtworkListsSaveResult

export enum ArtworkListMode {
  AddingArtworkListIDs = "addingArtworkListIDs",
  RemovingArtworkListIDs = "removingArtworkListIDs",
}

export type ArtworkListState = {
  createNewArtworkListViewVisible: boolean
  artwork: ArtworkEntity | null
  recentlyAddedArtworkList: RecentlyAddedArtworkList | null
  selectedArtworkListIDs: string[]
  addingArtworkListIDs: string[]
  removingArtworkListIDs: string[]
}

export type ArtworkListAction =
  | { type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE"; payload: boolean }
  | { type: "SET_ARTWORK"; payload: ArtworkEntity | null }
  | { type: "SET_RECENTLY_ADDED_ARTWORK_LIST"; payload: RecentlyAddedArtworkList | null }
  | { type: "RESET" }
  | {
      type: "ADD_OR_REMOVE_ARTWORK_LIST_ID"
      payload: { mode: ArtworkListMode; artworkListID: string }
    }
  | { type: "SET_SELECTED_ARTWORK_LIST_IDS"; payload: string[] }

export interface ArtworkListsContextState {
  state: ArtworkListState
  artworkListId?: string
  isSavedToArtworkList: boolean
  dispatch: Dispatch<ArtworkListAction>
  reset: () => void
  onSave: (result: SaveResult) => void
}
