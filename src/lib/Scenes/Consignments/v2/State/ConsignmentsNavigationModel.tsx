import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { AppStoreModel } from "lib/store/AppStoreModel"
import { isEmpty } from "lodash"
import { RefObject } from "react"
import { NavigatorIOS } from "react-native"
import { MyCollectionAddArtworkAddPhotos } from "../Screens/AddArtwork/Screens/MyCollectionAddArtworkAddPhotos"
import { MyCollectionAddArtworkTitleAndYear } from "../Screens/AddArtwork/Screens/MyCollectionAddArtworkTitleAndYear"

type ModalType = "add" | "edit" | null

export interface ConsignmentsNavigationModel {
  sessionState: {
    modalType: ModalType
    navViewRef: RefObject<any>
    navigator: NavigatorIOS | null
  }

  setupNavigation: Action<
    ConsignmentsNavigationModel,
    {
      navViewRef: RefObject<any>
    }
  >

  setNavigator: Action<ConsignmentsNavigationModel, NavigatorIOS>

  goBack: Action<ConsignmentsNavigationModel>

  // Modals
  dismissModal: Action<ConsignmentsNavigationModel>

  // Listeners
  onAddArtworkComplete: ThunkOn<ConsignmentsNavigationModel, {}, AppStoreModel>
  onEditArtworkComplete: ThunkOn<ConsignmentsNavigationModel, {}, AppStoreModel>

  // Nav actions
  navigateToAddArtwork: Action<ConsignmentsNavigationModel>
  navigateToAddArtworkPhotos: Thunk<ConsignmentsNavigationModel, any, any, AppStoreModel>
  navigateToAddTitleAndYear: Action<ConsignmentsNavigationModel>
  navigateToArtworkDetail: Action<ConsignmentsNavigationModel, string>
  navigateToArtworkList: Action<ConsignmentsNavigationModel>
  navigateToHome: Action<ConsignmentsNavigationModel>
  navigateToMarketingHome: Action<ConsignmentsNavigationModel>

  // External app locations
  navigateToConsign: Action<ConsignmentsNavigationModel>
  navigateToArtist: Action<ConsignmentsNavigationModel>
}

export const ConsignmentsNavigationModel: ConsignmentsNavigationModel = {
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

  dismissModal: action(state => {
    state.sessionState.modalType = null
  }),

  /**
   * Listeners
   */

  onAddArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.consignments.artwork.addArtworkComplete,
    actions => {
      // TODO: fill in the actual artwork id ("1")
      actions.navigateToArtworkDetail("1")

      setTimeout(() => {
        actions.dismissModal()
      })
    }
  ),

  onEditArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.consignments.artwork.editArtworkComplete,
    actions => {
      actions.dismissModal()
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

  navigateToAddArtworkPhotos: thunk((_actions, _payload, { getState, getStoreState, getStoreActions }) => {
    const { navigator } = getState().sessionState
    const { artwork: artworkState } = getStoreState().consignments
    const { artwork: artworkActions } = getStoreActions().consignments

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
