import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { AppStoreModel } from "lib/store/AppStoreModel"
import { isEmpty } from "lodash"
import { RefObject } from "react"
import { NavigatorIOS } from "react-native"
import { MyCollectionAddArtworkAddPhotos } from "../Screens/AddArtwork/Screens/MyCollectionAddArtworkAddPhotos"
import { MyCollectionAddArtworkTitleAndYear } from "../Screens/AddArtwork/Screens/MyCollectionAddArtworkTitleAndYear"

type ModalType = "add" | "edit" | null

export interface MyCollectionNavigationModel {
  sessionState: {
    modalType: ModalType
    navViewRef: RefObject<any>
    navigator: NavigatorIOS | null
  }

  setupNavigation: Action<
    MyCollectionNavigationModel,
    {
      navViewRef: RefObject<any>
    }
  >

  setNavigator: Action<MyCollectionNavigationModel, NavigatorIOS>

  goBack: Action<MyCollectionNavigationModel>

  // Modals
  setModalType: Action<MyCollectionNavigationModel, ModalType>
  dismissModal: Action<MyCollectionNavigationModel>

  // Listeners
  onAddArtworkComplete: ThunkOn<MyCollectionNavigationModel, {}, AppStoreModel>
  onEditArtworkComplete: ThunkOn<MyCollectionNavigationModel, {}, AppStoreModel>

  // Nav actions
  navigateToAddArtwork: Action<MyCollectionNavigationModel>
  navigateToAddArtworkPhotos: Thunk<MyCollectionNavigationModel, any, any, AppStoreModel>
  navigateToAddTitleAndYear: Action<MyCollectionNavigationModel>
  navigateToArtworkDetail: Action<MyCollectionNavigationModel, string>
  navigateToArtworkList: Action<MyCollectionNavigationModel>
  navigateToEditArtwork: Thunk<MyCollectionNavigationModel, any, any, AppStoreModel>
  navigateToHome: Action<MyCollectionNavigationModel>
  navigateToMarketingHome: Action<MyCollectionNavigationModel>

  // External app locations
  navigateToConsign: Action<MyCollectionNavigationModel>
  navigateToArtist: Action<MyCollectionNavigationModel>
}

export const MyCollectionNavigationModel: MyCollectionNavigationModel = {
  sessionState: {
    modalType: null,
    navViewRef: { current: null },
    navigator: null,
  },

  setupNavigation: action((state, { navViewRef }) => {
    if (!state.sessionState.navViewRef.current) {
      state.sessionState.navViewRef = navViewRef
    }
  }),

  setNavigator: action((state, navigator) => {
    state.sessionState.navigator = navigator
  }),

  goBack: action(state => {
    state.sessionState.navigator?.pop()
  }),

  setModalType: action((state, payload) => {
    state.sessionState.modalType = payload
  }),

  dismissModal: action(state => {
    state.sessionState.modalType = null
  }),

  /**
   * Listeners
   */

  onAddArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.myCollection.artwork.addArtworkComplete,
    (actions, _, { getStoreState }) => {
      actions.navigateToArtworkDetail(getStoreState().myCollection.artwork.sessionState.artworkId)

      setTimeout(() => {
        actions.dismissModal()
      })
    }
  ),

  onEditArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.myCollection.artwork.editArtworkComplete,
    (actions, _, { getStoreState }) => {
      actions.navigateToArtworkDetail(getStoreState().myCollection.artwork.sessionState.artworkId)

      setTimeout(() => {
        actions.dismissModal()
      })
    }
  ),

  /**
   * Nav Actions
   */

  navigateToAddArtwork: action(state => {
    state.sessionState.modalType = "add"

    // FIXME: Remove from AppRegistry / ARNavigation / delete files
    // SwitchBoard.presentModalViewController(state.navViewRef.current, "/my-collection/add-artwork")
  }),

  navigateToEditArtwork: thunk((actions, payload, { getStoreActions }) => {
    getStoreActions().myCollection.artwork.startEditingArtwork(payload)
    actions.setModalType("edit")
  }),

  navigateToAddArtworkPhotos: thunk((_actions, _payload, { getState, getStoreState, getStoreActions }) => {
    const { navigator } = getState().sessionState
    const { artwork: artworkState } = getStoreState().myCollection
    const { artwork: artworkActions } = getStoreActions().myCollection

    if (isEmpty(artworkState.sessionState.formValues.photos)) {
      artworkActions.takeOrPickPhotos()
    } else {
      navigator?.push({
        component: MyCollectionAddArtworkAddPhotos,
      })
    }
  }),

  navigateToAddTitleAndYear: action(state => {
    state.sessionState.navigator?.push({
      component: MyCollectionAddArtworkTitleAndYear,
    })
  }),

  navigateToArtworkDetail: action((state, artworkID) => {
    SwitchBoard.presentNavigationViewController(
      state.sessionState.navViewRef.current,
      `/my-collection/artwork-detail/${artworkID}`
    )
  }),

  navigateToArtworkList: action(state => {
    SwitchBoard.presentNavigationViewController(state.sessionState.navViewRef.current, "/my-collection/artwork-list")
  }),

  navigateToMarketingHome: action(state => {
    SwitchBoard.presentNavigationViewController(state.sessionState.navViewRef.current, "/my-collection/marketing-home")
  }),

  navigateToHome: action(state => {
    SwitchBoard.presentNavigationViewController(state.sessionState.navViewRef.current, "/my-collection/home")
  }),

  /**
   * External app navigtion
   */

  navigateToConsign: action(state => {
    SwitchBoard.presentModalViewController(
      state.sessionState.navViewRef.current,
      "/collections/my-collection/artworks/new/submissions/new"
    )
  }),

  navigateToArtist: action(state => {
    SwitchBoard.presentModalViewController(state.sessionState.navViewRef.current, "/artist/cindy-sherman")
  }),
}
