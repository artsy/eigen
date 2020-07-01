import { Action, action } from "easy-peasy"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { RefObject } from "react"
import { NavigatorIOS } from "react-native"
import { MyCollectionAddArtworkAddPhotos } from "../Screens/MyCollectionAddArtwork/Screens/MyCollectionAddArtworkAddPhotos"
import { MyCollectionAddArtworkTitleAndYear } from "../Screens/MyCollectionAddArtwork/Screens/MyCollectionAddArtworkTitleAndYear"

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
