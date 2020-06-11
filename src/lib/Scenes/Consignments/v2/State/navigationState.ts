import { Action, action } from "easy-peasy"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { RefObject } from "react"

export interface NavigationState {
  navRef: RefObject<any>
  setupNavigation: Action<NavigationState, RefObject<any>>

  // Nav actions
  navigateToAddArtwork: Action<NavigationState>
  navigateToArtworkDetail: Action<NavigationState>
  navigateToArtworkList: Action<NavigationState>
  navigateToHome: Action<NavigationState>
}

export const navigationState: NavigationState = {
  navRef: {
    current: null,
  },

  setupNavigation: action((state, navRef) => {
    state.navRef = navRef
  }),

  navigateToAddArtwork: action(state => {
    SwitchBoard.presentNavigationViewController(state.navRef.current, "/my-collection/add-artwork")
  }),

  navigateToArtworkDetail: action(state => {
    SwitchBoard.presentNavigationViewController(state.navRef.current, "/my-collection/artwork-detail")
  }),

  navigateToArtworkList: action(state => {
    SwitchBoard.presentNavigationViewController(state.navRef.current, "/my-collection/artwork-list")
  }),

  navigateToHome: action(state => {
    SwitchBoard.presentNavigationViewController(state.navRef.current, "/my-collection/home")
  }),
}
