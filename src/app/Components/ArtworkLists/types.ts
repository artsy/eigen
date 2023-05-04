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

export type SaveResult =
  | {
      action: ResultAction.SavedToDefaultArtworkList
      artwork: ArtworkEntity
    }
  | {
      action: ResultAction.RemovedFromDefaultArtworkList
    }
  | {
      action: ResultAction.ModifiedArtworkLists
    }

export enum ArtworkListMode {
  AddingArtworkList = "addingArtworkLists",
  RemovingArtworkList = "removingArtworkLists",
}

export interface ArtworkListEntity {
  internalID: string
  name: string
}

export type ArtworkListState = {
  createNewArtworkListViewVisible: boolean
  artwork: ArtworkEntity | null
  recentlyAddedArtworkList: RecentlyAddedArtworkList | null
  selectedArtworkListIDs: string[]
  addingArtworkLists: ArtworkListEntity[]
  removingArtworkLists: ArtworkListEntity[]
}

export type ArtworkListAction =
  | { type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE"; payload: boolean }
  | { type: "SET_ARTWORK"; payload: ArtworkEntity | null }
  | { type: "SET_RECENTLY_ADDED_ARTWORK_LIST"; payload: RecentlyAddedArtworkList | null }
  | { type: "RESET" }
  | {
      type: "ADD_OR_REMOVE_ARTWORK_LIST"
      payload: { mode: ArtworkListMode; artworkList: ArtworkListEntity }
    }
  | { type: "SET_SELECTED_ARTWORK_LIST_IDS"; payload: string[] }

export interface ArtworkListsContextState {
  state: ArtworkListState
  artworkListId?: string
  isSavedToArtworkList: boolean
  addingArtworkListIDs: string[]
  removingArtworkListIDs: string[]
  dispatch: Dispatch<ArtworkListAction>
  reset: () => void
  onSave: (result: SaveResult) => void
}
