import { NavigationContainerRef, StackActions } from "@react-navigation/native"
import { ViewDescriptor } from "lib/navigation/navigate"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { last } from "lodash"
import { NativeModules } from "react-native"

/**
 * Here we maintain references to all the navigators in the main app navigation hierarchy, which are:
 * - tab nav stacks
 *   i.e. what you see whe you switch to a particular tab
 * - the main modal stack
 *   i.e. the place where global modals are presented (excluding FancyModal)
 * - modal nav stacks
 *   i.e. the navigation stack _within_ a presented modal.
 *   These are unique in that they are created and destroyed, while all the others are only created once
 */

// tslint:disable-next-line:variable-name
export const __unsafe_tabStackNavRefs: Record<BottomTabType, React.MutableRefObject<NavigationContainerRef | null>> = {
  home: { current: null },
  search: { current: null },
  inbox: { current: null },
  sell: { current: null },
  profile: { current: null },
}

// tslint:disable-next-line:variable-name
export const __unsafe_mainModalStackRef = { current: null as NavigationContainerRef | null }

// tslint:disable-next-line:variable-name
export const __unsafe_modalNavStackRefs: {
  [routeKey: string]: React.RefObject<NavigationContainerRef>
} = {}

// If the user is looking at a modal, return the nav stack ref for that modal, otherwise return null.
function getCurrentlyPresentedModalNavStackRef() {
  const mainModalStackRoutes = __unsafe_mainModalStackRef.current?.getRootState().routes

  if (!mainModalStackRoutes || mainModalStackRoutes.length <= 1) {
    // the user is not looking at a modal.
    return null
  }

  const key = last(mainModalStackRoutes)?.key
  if (!key) {
    throw new Error("Couldn't get modal key")
  }

  // and call dispatch on the ref that we should have already
  const ref = __unsafe_modalNavStackRefs[key]
  if (!ref) {
    throw new Error("Couldn't get modal ref")
  }

  return ref
}

export const ARScreenPresenterModule: typeof NativeModules["ARScreenPresenterModule"] = {
  presentModal(viewDescriptor: ViewDescriptor) {
    __unsafe_mainModalStackRef.current?.dispatch(
      StackActions.push("modal", { rootModuleName: viewDescriptor.moduleName, rootModuleProps: viewDescriptor.props })
    )
    // _presentModal(viewDescriptor)
  },
  async popToRootAndScrollToTop(selectedTab: BottomTabType) {
    __unsafe_tabStackNavRefs[selectedTab].current?.dispatch(StackActions.popToTop())
    // TODO: scroll to top
  },
  popToRootOrScrollToTop(selectedTab: BottomTabType) {
    const state = __unsafe_tabStackNavRefs[selectedTab].current?.getRootState()!
    if (state.routes.length > 1) {
      __unsafe_tabStackNavRefs[selectedTab].current?.dispatch(StackActions.popToTop())
    } else {
      // TODO: scroll to top
    }
  },
  pushView(selectedTab: BottomTabType, viewDescriptor: ViewDescriptor) {
    // is the user looking at a modal right now?
    // if so, push onto that modal's nav stack
    const modalNavStackRef = getCurrentlyPresentedModalNavStackRef()
    if (modalNavStackRef) {
      modalNavStackRef.current?.dispatch(
        StackActions.push("screen", { moduleName: viewDescriptor.moduleName, props: viewDescriptor.props })
      )
      return
    }
    // otherwise push onto the current tab's nav stack
    __unsafe_tabStackNavRefs[selectedTab].current?.dispatch(
      StackActions.push("screen", { moduleName: viewDescriptor.moduleName, props: viewDescriptor.props })
    )
    // TODO: check whether this function works when called immediately after switching tab
    // e.g. when opening a deep link to a conversation.
    // It probably won't work in cases where the tab's navigator hasn't been mounted yet.
  },
  popStack(selectedTab: BottomTabType) {
    // if user is not looking at modal, pop the current tab's nav stack
    __unsafe_tabStackNavRefs[selectedTab].current?.dispatch(StackActions.pop())
  },
  goBack(selectedTab: BottomTabType) {
    const modalNavStackRef = getCurrentlyPresentedModalNavStackRef()
    // if the user is looking at a modal
    if (modalNavStackRef) {
      // if the modal has more than one screen in its nav stack, pop the stack
      if ((modalNavStackRef.current?.getRootState().routes.length ?? 0) > 1) {
        modalNavStackRef.current?.dispatch(StackActions.pop())
        return
      }
      // otherwise dismiss the modal
      __unsafe_mainModalStackRef.current?.dispatch(StackActions.pop())
      return
    }
    // if the user is not looking at a modal, pop the current tab's nav stack
    __unsafe_tabStackNavRefs[selectedTab].current?.dispatch(StackActions.pop())
  },
  dismissModal(..._args: any[]) {
    __unsafe_mainModalStackRef.current?.dispatch(StackActions.pop())
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
