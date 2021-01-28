import { NavigationContainerRef, StackActions } from "@react-navigation/native"
import { ViewDescriptor } from "lib/navigation/navigate"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { NativeModules } from "react-native"

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

const isLookingAtModal = () => (__unsafe_mainModalStackRef.current?.getRootState().routes.length ?? 0) > 1

const getCurrentModalNavStackRef = () => {
  // get the current modal's route key
  const key = __unsafe_mainModalStackRef.current?.getCurrentRoute()?.key
  if (!key) {
    throw new Error("Coulnd't get modal key")
  }
  // and call dispatch on the ref that we should have already
  const ref = __unsafe_modalNavStackRefs[key]
  if (!ref) {
    throw new Error("Coulnd't get modal ref")
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
    if (isLookingAtModal()) {
      getCurrentModalNavStackRef().current?.dispatch(
        StackActions.push("screen", { moduleName: viewDescriptor.moduleName, props: viewDescriptor.props })
      )
      return
    }
    // otherwise push onto the current tab's nav stack
    __unsafe_tabStackNavRefs[selectedTab].current?.dispatch(
      StackActions.push("screen", { moduleName: viewDescriptor.moduleName, props: viewDescriptor.props })
    )
  },
  popStack(selectedTab: BottomTabType) {
    // if user is not looking at modal, pop the current tab's nav stack
    __unsafe_tabStackNavRefs[selectedTab].current?.dispatch(StackActions.pop())
  },
  goBack(selectedTab: BottomTabType) {
    // if user is looking at a modal
    if (isLookingAtModal()) {
      //   if modal has more than one screen in it's nav stack, pop the stack
      if ((getCurrentModalNavStackRef().current?.getRootState().routes.length ?? 0) > 1) {
        getCurrentModalNavStackRef().current?.dispatch(StackActions.pop())
        return
      }
      //   otherwise dismiss the modal
      __unsafe_mainModalStackRef.current?.dispatch(StackActions.pop())
      return
    }
    // if user is not looking at a modal, pop the current tab's nav stack
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
