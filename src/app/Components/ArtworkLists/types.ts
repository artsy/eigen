export interface RecentlyAddedArtworkList {
  internalID: string
  name: string
}

export interface ArtworkEntity {
  id: string
  internalID: string
  title: string
  year: string | null | undefined
  artistNames: string | null | undefined
  imageURL: string | null | undefined
  isInAuction: boolean | null | undefined
}

export enum ArtworkListMode {
  AddingArtworkList = "addingArtworkLists",
  RemovingArtworkList = "removingArtworkLists",
}

export enum ArtworkListOfferSettingsMode {
  SharingArtworkLists = "sharingArtworkLists",
  KeepingArtworkListsPrivate = "keepingArtworkListsPrivate",
}

export interface ArtworkListEntity {
  internalID: string
  name: string
}

export type ArtworkListState = {
  selectArtworkListsViewVisible: boolean
  createNewArtworkListViewVisible: boolean
  artworkListOfferSettingsViewVisible: boolean
  artwork: ArtworkEntity | null
  artworkListID: string | null
  recentlyAddedArtworkList: RecentlyAddedArtworkList | null
  selectedTotalCount: number
  addingArtworkLists: ArtworkListEntity[]
  removingArtworkLists: ArtworkListEntity[]
  sharingArtworkLists: ArtworkListEntity[]
  keepingArtworkListsPrivate: ArtworkListEntity[]
  hasUnsavedChanges: boolean
  toastBottomPadding: number | null
}

export const getArtworkListsStoreInitialState = () => ARTWORK_LISTS_STORE_INITIAL_STATE

export const ARTWORK_LISTS_STORE_INITIAL_STATE: ArtworkListState = {
  selectArtworkListsViewVisible: false,
  createNewArtworkListViewVisible: false,
  artworkListOfferSettingsViewVisible: false,
  artwork: null,
  artworkListID: null,
  recentlyAddedArtworkList: null,
  selectedTotalCount: 0,
  addingArtworkLists: [],
  removingArtworkLists: [],
  keepingArtworkListsPrivate: [],
  sharingArtworkLists: [],
  hasUnsavedChanges: false,
  toastBottomPadding: null,
}
