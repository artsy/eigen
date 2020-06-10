import { Action, action } from "easy-peasy"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { RefObject } from "react"

export interface NavigationState {
  navigateToAddWork: Action<NavigationState, RefObject<any>> // FIXME: any
}

export const navigationState: NavigationState = {
  navigateToAddWork: action((_state, navRef) => {
    SwitchBoard.presentModalViewController(navRef.current, "/collections/my-collection/artworks/new/submissions/new")
  }),
}
