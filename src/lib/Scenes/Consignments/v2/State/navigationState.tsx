import { Action, action, ThunkOn, thunkOn } from "easy-peasy"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { RefObject } from "react"
import { NavigatorIOS } from "react-native"
import { MyCollectionAddArtworkAddPhotos } from "../Screens/MyCollectionAddArtwork/Screens/MyCollectionAddArtworkAddPhotos"
import { MyCollectionAddArtworkTitleAndYear } from "../Screens/MyCollectionAddArtwork/Screens/MyCollectionAddArtworkTitleAndYear"
import { StoreState } from "./store"

export interface NavigationState {
  navViewRef: RefObject<any>
  navigator: NavigatorIOS | null

  setupNavigation: Action<
    NavigationState,
    {
      navViewRef: RefObject<any>
      navigator: NavigatorIOS
    }
  >

  pop: Action<NavigationState>

  // Listeners
  onArtworkAdded: ThunkOn<NavigationState, {}, StoreState>

  // Nav actions
  navigateToAddArtwork: Action<NavigationState>
  navigateToAddArtworkPhotos: Action<NavigationState>
  navigateToAddTitleAndYear: Action<NavigationState>
  navigateToArtworkDetail: Action<NavigationState>
  navigateToArtworkList: Action<NavigationState>
  navigateToHome: Action<NavigationState>
  navigateToMarketingHome: Action<NavigationState>
}

export const navigationState: NavigationState = {
  navViewRef: { current: null },
  navigator: null,

  setupNavigation: action((state, { navViewRef, navigator }) => {
    if (!state.navViewRef.current) {
      state.navViewRef = navViewRef
    }

    state.navigator = navigator
  }),

  pop: action(state => {
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
      component: MyCollectionAddArtworkAddPhotos,
      title: "Add photos",
    })
  }),

  navigateToAddTitleAndYear: action(state => {
    state.navigator?.push({
      component: MyCollectionAddArtworkTitleAndYear,
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
