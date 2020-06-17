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

  // Listeners
  onArtworkAdded: ThunkOn<NavigationModel, {}, StoreModel>

  // Nav actions
  navigateToAddArtwork: Action<NavigationModel>
  navigateToAddArtworkPhotos: Action<NavigationModel>
  navigateToAddTitleAndYear: Action<NavigationModel>
  navigateToArtworkDetail: Action<NavigationModel>
  navigateToArtworkList: Action<NavigationModel>
  navigateToHome: Action<NavigationModel>
  navigateToMarketingHome: Action<NavigationModel>
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

  /**
   * Listeners
   */

  onArtworkAdded: thunkOn(
    (_, storeActions) => storeActions.artwork.addArtwork,
    actions => {
      actions.navigateToArtworkList()

      // Fake timeout demonstrating how we can move through screens and show the
      // new artwork added to list view -> detail view animation.
      setTimeout(() => {
        actions.navigateToArtworkDetail()
      }, 1000)
    }
  ),

  /**
   * Nav Actions
   */

  navigateToAddArtwork: action(state => {
    SwitchBoard.presentNavigationViewController(state.navViewRef.current, "/my-collection/add-artwork")
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

  navigateToArtworkDetail: action(state => {
    SwitchBoard.presentNavigationViewController(state.navViewRef.current, "/my-collection/artwork-detail")
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
}
