import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import {
  getArtworkListsStoreInitialState,
  ArtworkListEntity,
} from "app/Components/ArtworkLists/types"
import { ArtworkListOfferSettingsView } from "app/Components/ArtworkLists/views/ArtworkListOfferSettingsView/ArtworkListOfferSettingsView"
import { CreateNewArtworkListView } from "app/Components/ArtworkLists/views/CreateNewArtworkListView/CreateNewArtworkListView"
import { SelectArtworkListsForArtworkView } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/SelectArtworkListsForArtworkView"
import { Action, action, Computed, computed, createContextStore } from "easy-peasy"
import { ArtworkListState } from "./types"

export type ModifiedListType =
  | "GENERIC_CHANGES"
  | "ADDED_AND_REMOVED_LIST"
  | "ADDED_SINGLE_LIST"
  | "ADDED_MULTIPLE_LIST"
  | "REMOVED_SINGLE_LIST"
  | "REMOVED_MULTIPLE_LIST"

export interface ArtworkListsModel {
  // State
  state: ArtworkListState
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
  state: getArtworkListsStoreInitialState(),

  // Computed properties
  addingArtworkListIDs: computed((state) =>
    state.state.addingArtworkLists.map((entity) => entity.internalID)
  ),
  removingArtworkListIDs: computed((state) =>
    state.state.removingArtworkLists.map((entity) => entity.internalID)
  ),
  shareArtworkListIDs: computed((state) =>
    state.state.sharingArtworkLists.map((entity) => entity.internalID)
  ),
  keepArtworkListPrivateIDs: computed((state) =>
    state.state.keepingArtworkListsPrivate.map((entity) => entity.internalID)
  ),
  modifiedActionType: computed((state) => {
    return () => {
      if (!state.state.artworkListID) {
        const addingArtworkLists = state.state.addingArtworkLists
        const removingArtworkLists = state.state.removingArtworkLists
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

      const isArtworkListAdded = state.state.addingArtworkLists.some(
        (list) => list.internalID === state.state.artworkListID
      )
      const isArtworkListRemoved = state.state.removingArtworkLists.some(
        (list) => list.internalID === state.state.artworkListID
      )

      if ((isArtworkListAdded || isArtworkListRemoved) && !!state.state.artwork) {
        return "ADDED_AND_REMOVED_LIST"
      }

      throw new Error("Unexpected save result for artwork lists")
    }
  }),

  // Actions
  setToastBottomPadding: action((state, payload) => {
    state.state.toastBottomPadding = payload
  }),

  setCreateNewArtworkListViewVisible: action((state, payload) => {
    state.state.createNewArtworkListViewVisible = payload
  }),

  openSelectArtworkListsView: action((state, payload) => {
    state.state.artwork = payload
    state.state.artworkListID = null
    state.state.selectArtworkListsViewVisible = true
  }),

  reset: action((state) => {
    state.state = {
      ...getArtworkListsStoreInitialState(),
      toastBottomPadding: state.state.toastBottomPadding,
    }
  }),

  setRecentlyAddedArtworkList: action((state, payload) => {
    state.state.recentlyAddedArtworkList = payload
  }),

  addOrRemoveArtworkList: action((state, payload) => {
    const { artworkList, mode } = payload
    const artworkLists = state.state[mode]
    const ids = artworkLists.map((artworkList) => artworkList.internalID)
    const updatedState = { ...state.state }

    if (ids.includes(artworkList.internalID)) {
      updatedState[mode] = artworkLists.filter(
        (entity) => entity.internalID !== artworkList.internalID
      )
    } else {
      updatedState[mode] = [...artworkLists, artworkList]
    }

    updatedState.hasUnsavedChanges = hasChanges(updatedState)

    state.state = updatedState
  }),

  setSelectedTotalCount: action((state, payload) => {
    state.state.selectedTotalCount = payload
  }),

  setUnsavedChanges: action((state, payload) => {
    state.state.hasUnsavedChanges = payload
  }),

  setOfferSettingsViewVisible: action((state, payload) => {
    state.state.artworkListOfferSettingsViewVisible = payload
  }),

  shareOrKeepArtworkListPrivate: action((state, payload) => {
    const { artworkList, mode } = payload
    const artworkLists = state.state[mode]
    const ids = artworkLists.map((list) => list.internalID)

    if (ids.includes(artworkList.internalID)) {
      state.state[mode] = artworkLists.filter(
        (entity) => entity.internalID !== artworkList.internalID
      )
    } else {
      state.state[mode] = [...artworkLists, artworkList]
    }

    state.state.hasUnsavedChanges = hasOfferSettingChanges(state.state)
  }),
})

export const ArtworkListsStore = createContextStore((initialData) => ({
  ...getArtworkListsModel(),
  ...initialData,
}))

export const ArtworkListsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ArtworkListsStore.Provider runtimeModel={{ state: { ...getArtworkListsStoreInitialState() } }}>
      <ListElements>{children}</ListElements>
    </ArtworkListsStore.Provider>
  )
}

const ListElements: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    artwork,
    artworkListOfferSettingsViewVisible,
    createNewArtworkListViewVisible,
    selectArtworkListsViewVisible,
  } = ArtworkListsStore.useStoreState((state) => ({
    artwork: state.state.artwork,
    artworkListOfferSettingsViewVisible: state.state.artworkListOfferSettingsViewVisible,
    selectArtworkListsViewVisible: state.state.selectArtworkListsViewVisible,
    createNewArtworkListViewVisible: state.state.createNewArtworkListViewVisible,
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
