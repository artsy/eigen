import { Action, action, ThunkOn, thunkOn } from "easy-peasy"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { RefObject } from "react"
import { NavigatorIOS } from "react-native"
import { setupMyCollectionScreen } from "../Boot"
import { MyCollectionAddArtworkAddPhotos } from "../Screens/MyCollectionAddArtwork/Screens/MyCollectionAddArtworkAddPhotos"
import { MyCollectionAddArtworkTitleAndYear } from "../Screens/MyCollectionAddArtwork/Screens/MyCollectionAddArtworkTitleAndYear"
import { StoreModel } from "./store"

export interface NavigationModel {
  navViewRef: RefObject<any>
  navigator: NavigatorIOS | null

  setupNavigation: Action<
    NavigationModel,
    {
      navViewRef: RefObject<any>
      navigator: NavigatorIOS
    }
  >

  goBack: Action<NavigationModel>
  dismissModal: Action<NavigationModel>

  // Listeners
  onAddArtworkComplete: ThunkOn<NavigationModel, {}, StoreModel>
  onEditArtworkComplete: ThunkOn<NavigationModel, {}, StoreModel>

  // Nav actions
  navigateToAddArtwork: Action<NavigationModel>
  navigateToAddArtworkPhotos: Action<NavigationModel>
  navigateToAddTitleAndYear: Action<NavigationModel>
  navigateToArtworkDetail: Action<NavigationModel, string>
  navigateToArtworkList: Action<NavigationModel>
  navigateToHome: Action<NavigationModel>
  navigateToMarketingHome: Action<NavigationModel>

  // External app locations
  navigateToConsign: Action<NavigationModel>
  navigateToArtist: Action<NavigationModel>
}

export const navigationModel: NavigationModel = {
  navViewRef: { current: null },
  navigator: null,

  setupNavigation: action((state, { navViewRef, navigator }) => {
    if (!state.navViewRef.current) {
      state.navViewRef = navViewRef
    }

    state.navigator = navigator
  }),

  goBack: action(state => {
    state.navigator?.pop()
  }),

  dismissModal: action(state => {
    SwitchBoard.dismissModalViewController(state.navViewRef.current)
  }),

  /**
   * Listeners
   */

  onAddArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.artwork.addArtworkComplete,
    actions => {
      // TODO - fill in the actual artwork id ("1")
      actions.navigateToArtworkDetail("1")

      setTimeout(() => {
        actions.dismissModal()
      })
    }
  ),

  onEditArtworkComplete: thunkOn(
    (_, storeActions) => storeActions.artwork.editArtworkComplete,
    actions => {
      actions.dismissModal()
    }
  ),

  /**
   * Nav Actions
   */

  navigateToAddArtwork: action(state => {
    SwitchBoard.presentModalViewController(state.navViewRef.current, "/my-collection/add-artwork")
  }),

  navigateToAddArtworkPhotos: action(state => {
    state.navigator?.push({
      component: setupMyCollectionScreen(MyCollectionAddArtworkAddPhotos),
      title: "Add photos",
    })
  }),

  navigateToAddTitleAndYear: action(state => {
    state.navigator?.push({
      component: setupMyCollectionScreen(MyCollectionAddArtworkTitleAndYear),
      title: "Add title & year",
    })
  }),

  navigateToArtworkDetail: action((state, payload) => {
    SwitchBoard.presentNavigationViewController(state.navViewRef.current, `/my-collection/artwork-detail/${payload}`)
  }),

  navigateToArtworkList: action(state => {
    SwitchBoard.presentNavigationViewController(state.navViewRef.current, "/my-collection/artwork-list")
  }),

  navigateToMarketingHome: action(state => {
    SwitchBoard.presentNavigationViewController(state.navViewRef.current, "/my-collection/marketing-home")
  }),

  navigateToHome: action(state => {
    SwitchBoard.presentNavigationViewController(state.navViewRef.current, "/my-collection/home")
  }),

  /**
   * External app navigtion
   */

  navigateToConsign: action(state => {
    SwitchBoard.presentModalViewController(
      state.navViewRef.current,
      "/collections/my-collection/artworks/new/submissions/new"
    )
  }),

  navigateToArtist: action(state => {
    SwitchBoard.presentModalViewController(state.navViewRef.current, "/artist/cindy-sherman")
  }),
}
