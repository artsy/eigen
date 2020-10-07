import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import { navigate } from "lib/navigation/navigate"
import { ConsignmentsHomeQueryRenderer } from "lib/Scenes/MyCollection/Screens/ConsignmentsHome/ConsignmentsHome"
import { AppStoreModel } from "lib/store/AppStoreModel"
import { isEmpty } from "lodash"
import { RefObject } from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { NavigatorProps, NavigatorTarget } from "../Components/Navigator"
import { AdditionalDetails } from "../Screens/AddArtwork/Screens/AdditionalDetails"
import { AddPhotos } from "../Screens/AddArtwork/Screens/AddPhotos"
import { MyCollectionArtworkDetailQueryRenderer } from "../Screens/ArtworkDetail/MyCollectionArtworkDetail"
import { ViewAllDetails } from "../Screens/ArtworkDetail/Screens/ViewAllDetails"
import { MyCollectionArtworkListQueryRenderer } from "../Screens/ArtworkList/MyCollectionArtworkList"
import { ConsignmentsSubmissionForm } from "../Screens/ConsignmentsHome/ConsignmentsSubmissionForm"

type ModalType = "add" | "edit" | null
export type InfoModalType = "demandIndex" | "priceEstimate" | "artistMarket" | "auctionResults" | null

export interface MyCollectionNavigationModel {
  sessionState: {
    modalType: ModalType
    infoModalType: InfoModalType
    navViewRef: RefObject<any>
    navigators: {
      [key: string]: NavigatorProps
    }
  }

  setupNavigation: Action<
    MyCollectionNavigationModel,
    {
      navViewRef: RefObject<any>
    }
  >

  addNavigator: Action<MyCollectionNavigationModel, NavigatorProps>

  goBack: Action<MyCollectionNavigationModel>
  goBackInModal: Action<MyCollectionNavigationModel>

  // Modals
  setModalType: Action<MyCollectionNavigationModel, ModalType>
  showInfoModal: Action<MyCollectionNavigationModel, InfoModalType>
  dismissModal: Action<MyCollectionNavigationModel>

  // Listeners
  onAddArtworkComplete: ThunkOn<MyCollectionNavigationModel, {}, AppStoreModel>
  onStartEditingArtwork: ThunkOn<MyCollectionNavigationModel, {}, AppStoreModel>
  onEditArtworkComplete: ThunkOn<MyCollectionNavigationModel, {}, AppStoreModel>
  onDeleteArtworkComplete: ThunkOn<MyCollectionNavigationModel, {}, AppStoreModel>

  // Nav actions
  navigateToArtworkList: Action<MyCollectionNavigationModel>
  navigateToAddArtwork: Action<MyCollectionNavigationModel>
  navigateToAddArtworkPhotos: Thunk<MyCollectionNavigationModel, any, any, AppStoreModel>
  navigateToAddAdditionalDetails: Action<MyCollectionNavigationModel>
  navigateToAllAuctions: Action<MyCollectionNavigationModel, string>
  navigateToArticleDetail: Action<MyCollectionNavigationModel, string>
  navigateToAllArticles: Action<MyCollectionNavigationModel, string>
  navigateToArtworkDetail: Action<
    MyCollectionNavigationModel,
    {
      artistInternalID: string
      artworkSlug: string
      medium: string | null
    }
  >
  navigateToViewAllArtworkDetails: Action<MyCollectionNavigationModel, { passProps: any }> // FIXME: any

  // External app locations
  navigateToConsignSubmission: Action<MyCollectionNavigationModel>
  navigateToConsignLearnMore: Action<MyCollectionNavigationModel>
}

export const MyCollectionNavigationModel: MyCollectionNavigationModel = {
  sessionState: {
    modalType: null,
    infoModalType: null,
    navViewRef: { current: null },
    navigators: {},
  },

  setupNavigation: action((state, { navViewRef }) => {
    if (!state.sessionState.navViewRef.current) {
      state.sessionState.navViewRef = navViewRef
    }
  }),

  /**
   * Add a new NavigatorIOS instance, targeted by name. For example, when the
   * modal slides up and we have additional screens to navigate between, we
   * need to know which navigator to use at any given time.
   */
  addNavigator: action((state, navigator) => {
    state.sessionState.navigators[navigator.name] = navigator
  }),

  goBack: action((state) => {
    getNavigatorIOS(state.sessionState, "main").pop()
  }),

  goBackInModal: action((state) => {
    getNavigatorIOS(state.sessionState, "modal").pop()
  }),

  setModalType: action((state, modalType) => {
    state.sessionState.modalType = modalType
  }),

  showInfoModal: action((state, infoModalType) => {
    state.sessionState.infoModalType = infoModalType
  }),

  dismissModal: action((state) => {
    state.sessionState.modalType = null
    state.sessionState.infoModalType = null
  }),

  /**
   * Listeners
   */

  onAddArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.myCollection.artwork.addArtworkComplete,
    (actions) => {
      actions.dismissModal()
    }
  ),

  onStartEditingArtwork: thunkOn(
    (_, storeActions) => storeActions.myCollection.artwork.startEditingArtwork,
    (actions) => {
      actions.setModalType("edit")
    }
  ),

  onEditArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.myCollection.artwork.editArtworkComplete,
    (actions) => {
      actions.dismissModal()
    }
  ),

  onDeleteArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.myCollection.artwork.deleteArtworkComplete,
    (actions) => {
      actions.navigateToArtworkList()
      actions.dismissModal()
    }
  ),

  /**
   * Nav Actions
   */

  navigateToArtworkList: action((state) => {
    getNavigatorIOS(state.sessionState).push({
      component: MyCollectionArtworkListQueryRenderer,
    })
  }),

  navigateToAddArtwork: action((state) => {
    state.sessionState.modalType = "add"

    // FIXME: Remove from AppRegistry / ARNavigation / delete files
    // SwitchBoard.presentModalViewController(state.navViewRef.current, "/my-collection/add-artwork")
  }),

  navigateToAddArtworkPhotos: thunk((_actions, _payload, { getState, getStoreState, getStoreActions }) => {
    const navigator = getNavigatorIOS(getState().sessionState, "modal")
    const { artwork: artworkState } = getStoreState().myCollection
    const { artwork: artworkActions } = getStoreActions().myCollection

    if (isEmpty(artworkState.sessionState.formValues.photos)) {
      artworkActions.takeOrPickPhotos()
    } else {
      navigator.push({
        component: AddPhotos,
      })
    }
  }),

  navigateToAddAdditionalDetails: action((state) => {
    getNavigatorIOS(state.sessionState, "modal").push({
      component: AdditionalDetails,
    })
  }),

  navigateToArtworkDetail: action((state, { artistInternalID, medium, artworkSlug }) => {
    getNavigatorIOS(state.sessionState).push({
      component: MyCollectionArtworkDetailQueryRenderer,
      passProps: {
        artistInternalID,
        artworkSlug,
        medium,
      },
    })

    // FIXME: Remove these obj-c files
    // SwitchBoard.presentNavigationViewController(
    //   state.sessionState.navViewRef.current,
    //   `/my-collection/artwork-detail/${artworkSlug}`
    // )
  }),

  navigateToAllAuctions: action((_state, artistID) => {
    /**
     * TODO: Investigate the need for setImmediate. Noticing a strange race condition
     * here where the store reducer updates before the action is done firing. Might
     * be some kind of issue with new `navigate` function
     */
    setImmediate(() => {
      navigate(`/artist/${artistID}/auction-results`)
    })
  }),

  navigateToArticleDetail: action((_state, slug) => {
    setImmediate(() => {
      navigate(`/article/${slug}`)
    })
  }),

  navigateToAllArticles: action((_state, slug) => {
    setImmediate(() => {
      navigate(`/artist/${slug}/articles`)
    })
  }),

  navigateToViewAllArtworkDetails: action((state, { passProps }) => {
    getNavigatorIOS(state.sessionState).push({
      component: ViewAllDetails,
      passProps,
    })
  }),

  /**
   * Pages outside of MyCollection
   */

  navigateToConsignLearnMore: action((state) => {
    getNavigatorIOS(state.sessionState).push({
      component: ConsignmentsHomeQueryRenderer,
      passProps: {
        // TODO: Eventually, when consignments submissions and MyCollection are merged,
        // these flags can go away
        isArrivingFromMyCollection: true,
      },
    })
  }),

  navigateToConsignSubmission: action((state) => {
    getNavigatorIOS(state.sessionState).push({
      component: ConsignmentsSubmissionForm,
      passProps: {
        // TODO: Eventually, when consignments submissions and MyCollection are merged,
        // these flags can go away
        isArrivingFromMyCollection: true,
      },
    })
  }),
}

/**
 * Finds and returns a NavigatorIOS instance by name. `navigators.main` refers to the main
 * navigator instance; `navigators.modal` refers to the one in the modal -- and so on.
 */
function getNavigatorIOS(
  state: MyCollectionNavigationModel["sessionState"],
  name: NavigatorTarget = "main"
): NavigatorIOS {
  const navigator = state.navigators[name].navigator
  if (!navigator) {
    throw new Error("MyCollectionNavigationModel.tsx - Navigator not found")
  }
  return navigator
}
