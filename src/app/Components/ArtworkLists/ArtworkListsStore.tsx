import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import {
  getArtworkListsStoreInitialState,
  ArtworkListEntity,
  ArtworkEntity,
  RecentlyAddedArtworkList,
  ArtworkListState,
} from "app/Components/ArtworkLists/types"
import { ArtworkListOfferSettingsView } from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/ArtworkListOfferSettingsView"
import { CreateNewArtworkListView } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/CreateNewArtworkListView"
import { SelectArtworkListsForArtworkView } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/SelectArtworkListsForArtworkView"
import { Action, action, Computed, computed, createContextStore } from "easy-peasy"
import { FC } from "react"

export type ModifiedListType =
  | "GENERIC_CHANGES"
  | "ADDED_AND_REMOVED_LIST"
  | "ADDED_SINGLE_LIST"
  | "ADDED_MULTIPLE_LIST"
  | "REMOVED_SINGLE_LIST"
  | "REMOVED_MULTIPLE_LIST"

export interface ArtworkListsModel {
  // State
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
  artworkListId?: string

  // Computed
  addingArtworkListIDs: Computed<this, string[]>
  removingArtworkListIDs: Computed<this, string[]>
  shareArtworkListIDs: Computed<this, string[]>
  keepArtworkListPrivateIDs: Computed<this, string[]>
  modifiedActionType: Computed<this, () => ModifiedListType | void>

  // Actions
  setToastBottomPadding: Action<this, number | null>
  setCreateNewArtworkListViewVisible: Action<this, boolean>
  openSelectArtworkListsView: Action<this, any>
  setRecentlyAddedArtworkList: Action<this, ArtworkListEntity | null>
  addOrRemoveArtworkList: Action<
    this,
    { artworkList: ArtworkListEntity; mode: "addingArtworkLists" | "removingArtworkLists" }
  >
  setSelectedTotalCount: Action<this, number>
  reset: Action<this>
  setUnsavedChanges: Action<this, boolean>
  setOfferSettingsViewVisible: Action<this, boolean>
  shareOrKeepArtworkListPrivate: Action<
    this,
    { artworkList: ArtworkListEntity; mode: "sharingArtworkLists" | "keepingArtworkListsPrivate" }
  >
}

export const getArtworkListsModel = (): ArtworkListsModel => ({
  ...getArtworkListsStoreInitialState(),

  // Computed properties
  addingArtworkListIDs: computed((state) =>
    state.addingArtworkLists.map((entity) => entity.internalID)
  ),
  removingArtworkListIDs: computed((state) =>
    state.removingArtworkLists.map((entity) => entity.internalID)
  ),
  shareArtworkListIDs: computed((state) =>
    state.sharingArtworkLists.map((entity) => entity.internalID)
  ),
  keepArtworkListPrivateIDs: computed((state) =>
    state.keepingArtworkListsPrivate.map((entity) => entity.internalID)
  ),
  modifiedActionType: computed((state) => {
    return () => {
      if (!state.artworkListID) {
        const addingArtworkLists = state.addingArtworkLists
        const removingArtworkLists = state.removingArtworkLists
        if (!!addingArtworkLists.length && !!removingArtworkLists.length) {
          return "GENERIC_CHANGES"
        }

        if (!!addingArtworkLists.length && addingArtworkLists.length === 1) {
          return "ADDED_SINGLE_LIST"
        }
        if (!!addingArtworkLists.length) {
          return "ADDED_MULTIPLE_LIST"
        }

        if (!!removingArtworkLists && removingArtworkLists.length === 1) {
          return "REMOVED_SINGLE_LIST"
        }
        if (!!removingArtworkLists.length) {
          return "REMOVED_MULTIPLE_LIST"
        }

        throw new Error("Unexpected save result for artwork lists")
      }

      const isArtworkListAdded = state.addingArtworkLists.some(
        (list) => list.internalID === state.artworkListID
      )
      const isArtworkListRemoved = state.removingArtworkLists.some(
        (list) => list.internalID === state.artworkListID
      )

      if ((isArtworkListAdded || isArtworkListRemoved) && !!state.artwork) {
        return "ADDED_AND_REMOVED_LIST"
      }

      throw new Error("Unexpected save result for artwork lists")
    }
  }),

  // Actions
  setToastBottomPadding: action((state, payload) => {
    state.toastBottomPadding = payload
  }),

  setCreateNewArtworkListViewVisible: action((state, payload) => {
    state.createNewArtworkListViewVisible = payload
  }),

  openSelectArtworkListsView: action((state, payload) => {
    state.artwork = payload
    state.artworkListID = null
    state.selectArtworkListsViewVisible = true
  }),

  reset: action((state) => {
    const initialState = getArtworkListsStoreInitialState()
    state.selectArtworkListsViewVisible = initialState.selectArtworkListsViewVisible
    state.createNewArtworkListViewVisible = initialState.createNewArtworkListViewVisible
    state.artworkListOfferSettingsViewVisible = initialState.artworkListOfferSettingsViewVisible
    state.artwork = initialState.artwork
    state.artworkListID = initialState.artworkListID
    state.recentlyAddedArtworkList = initialState.recentlyAddedArtworkList
    state.selectedTotalCount = initialState.selectedTotalCount
    state.addingArtworkLists = initialState.addingArtworkLists
    state.removingArtworkLists = initialState.removingArtworkLists
    state.keepingArtworkListsPrivate = initialState.keepingArtworkListsPrivate
    state.sharingArtworkLists = initialState.sharingArtworkLists
    state.hasUnsavedChanges = initialState.hasUnsavedChanges
  }),

  setRecentlyAddedArtworkList: action((state, payload) => {
    state.recentlyAddedArtworkList = payload
  }),

  addOrRemoveArtworkList: action((state, payload) => {
    const { artworkList, mode } = payload
    const artworkLists = state[mode]
    const ids = artworkLists.map((artworkList) => artworkList.internalID)
    const updatedState = { ...state }

    if (ids.includes(artworkList.internalID)) {
      updatedState[mode] = artworkLists.filter(
        (entity) => entity.internalID !== artworkList.internalID
      )
    } else {
      updatedState[mode] = [...artworkLists, artworkList]
    }

    updatedState.hasUnsavedChanges = hasChanges(updatedState)

    state = updatedState
  }),

  setSelectedTotalCount: action((state, payload) => {
    state.selectedTotalCount = payload
  }),

  setUnsavedChanges: action((state, payload) => {
    state.hasUnsavedChanges = payload
  }),

  setOfferSettingsViewVisible: action((state, payload) => {
    state.artworkListOfferSettingsViewVisible = payload
  }),

  shareOrKeepArtworkListPrivate: action((state, payload) => {
    const { artworkList, mode } = payload
    const artworkLists = state[mode]
    const ids = artworkLists.map((list) => list.internalID)

    if (ids.includes(artworkList.internalID)) {
      state[mode] = artworkLists.filter((entity) => entity.internalID !== artworkList.internalID)
    } else {
      state[mode] = [...artworkLists, artworkList]
    }

    state.hasUnsavedChanges = hasOfferSettingChanges(state)
  }),
})

export const ArtworkListsStore = createContextStore((initialData) => ({
  ...getArtworkListsModel(),
  ...initialData,
}))

export const ArtworkListsProvider: FC = ({ children }) => {
  return (
    <ArtworkListsStore.Provider runtimeModel={{ state: { ...getArtworkListsStoreInitialState() } }}>
      <ListElements>{children}</ListElements>
    </ArtworkListsStore.Provider>
  )
}

const ListElements: FC = ({ children }) => {
  const {
    artwork,
    artworkListOfferSettingsViewVisible,
    createNewArtworkListViewVisible,
    selectArtworkListsViewVisible,
  } = ArtworkListsStore.useStoreState((state) => ({
    artwork: state.artwork,
    artworkListOfferSettingsViewVisible: state.artworkListOfferSettingsViewVisible,
    selectArtworkListsViewVisible: state.selectArtworkListsViewVisible,
    createNewArtworkListViewVisible: state.createNewArtworkListViewVisible,
  }))

  return (
    <BottomSheetModalProvider>
      {children}

      <>
        {!!artwork && !!selectArtworkListsViewVisible && <SelectArtworkListsForArtworkView />}
        {!!artworkListOfferSettingsViewVisible && <ArtworkListOfferSettingsView />}
        {!!createNewArtworkListViewVisible && <CreateNewArtworkListView />}
      </>
    </BottomSheetModalProvider>
  )
}

const hasOfferSettingChanges = (state: ArtworkListState) => {
  return state.sharingArtworkLists.length !== 0 || state.keepingArtworkListsPrivate.length !== 0
}

const hasChanges = (state: ArtworkListState) => {
  return state.addingArtworkLists.length !== 0 || state.removingArtworkLists.length !== 0
}
