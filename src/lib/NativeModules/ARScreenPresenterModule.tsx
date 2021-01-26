import { NavigationContainerRef, StackActions } from "@react-navigation/native"
import { ViewDescriptor } from "lib/navigation/navigate"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { NativeModules } from "react-native"

// tslint:disable-next-line:variable-name
export const __unsafe_tabStackNavRefs: Record<BottomTabType, NavigationContainerRef | null> = {
  home: null,
  search: null,
  inbox: null,
  sell: null,
  profile: null,
}

export const ARScreenPresenterModule: typeof NativeModules["ARScreenPresenterModule"] = {
  presentModal(_viewDescriptor: ViewDescriptor) {
    // _presentModal(viewDescriptor)
  },
  async popToRootAndScrollToTop(selectedTab: BottomTabType) {
    __unsafe_tabStackNavRefs[selectedTab]?.dispatch(StackActions.popToTop())
    // TODO: scroll to top
  },
  popToRootOrScrollToTop(selectedTab: BottomTabType) {
    const state = __unsafe_tabStackNavRefs[selectedTab]?.getRootState()!
    if (state.routes.length > 1) {
      __unsafe_tabStackNavRefs[selectedTab]?.dispatch(StackActions.popToTop())
    } else {
      // TODO: scroll to top
    }
  },
  pushView(selectedTab: BottomTabType, viewDescriptor: ViewDescriptor) {
    __unsafe_tabStackNavRefs[selectedTab]?.dispatch(StackActions.push(viewDescriptor.moduleName, viewDescriptor.props))
  },
  popStack(selectedTab: BottomTabType) {
    __unsafe_tabStackNavRefs[selectedTab]?.dispatch(StackActions.pop())
  },
  goBack(selectedTab: BottomTabType) {
    // TODO: close modal if in a modal and stack has one elem.
    __unsafe_tabStackNavRefs[selectedTab]?.dispatch(StackActions.pop())
  },
  dismissModal(..._args: any[]) {
    // _dismissModal()
  },
  presentAugmentedRealityVIR: () => {
    console.warn("presentAugmentedRealityVIR not yet supported")
  },
  presentEmailComposer: () => {
    console.warn("presentEmailComposer not yet supported")
  },
  presentMediaPreviewController: () => {
    console.warn("presentMediaPreviewController not yet supported")
  },
  updateShouldHideBackButton: () => {
    console.warn("updateShouldHideBackButton not yet supported")
  },
}
