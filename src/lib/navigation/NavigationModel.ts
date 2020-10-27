import { Action, action, actionOn, ActionOn } from "easy-peasy"
import { AppModule } from "lib/AppRegistry"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import type { AppStoreModel } from "lib/store/AppStoreModel"

export interface ViewDescriptor {
  moduleName: AppModule
  props?: object
}

type ViewStack = ViewDescriptor[]

export interface NavigationModel {
  modalStack: ViewStack[]
  currentTab: BottomTabType
  tabStacks: { [k in BottomTabType]: ViewStack }
  onRehydrate: ActionOn<NavigationModel, AppStoreModel>
  push: Action<NavigationModel, ViewDescriptor>
  pop: Action<NavigationModel>
}

export const NavigationModel: NavigationModel = {
  modalStack: [],
  currentTab: "home",
  tabStacks: {
    home: [{ moduleName: "Home" }],
    inbox: [{ moduleName: "Inbox" }],
    profile: [{ moduleName: "MyProfile" }],
    search: [{ moduleName: "Search" }],
    sell: [{ moduleName: "SellTabApp" }],
  },
  onRehydrate: actionOn(
    (_, storeActions) => storeActions.rehydrate,
    (state) => {
      // keep the navigation state around at DEV time so refreshes don't take devs back to home screen
      if (!__DEV__) {
        Object.assign(state, NavigationModel)
      }
    }
  ),
  push: action((state, viewDescriptor) => {
    if (state.modalStack.length) {
      state.modalStack[state.modalStack.length - 1].push(viewDescriptor)
    } else {
      state.tabStacks[state.currentTab].push(viewDescriptor)
    }
  }),
  pop: action((state) => {
    if (state.modalStack.length) {
      const stack = state.modalStack[state.modalStack.length - 1]
      if (stack.length <= 1) {
        state.modalStack.pop()
      } else {
        stack.pop()
      }
    } else if (state.tabStacks[state.currentTab].length > 1) {
      state.tabStacks[state.currentTab].pop()
    }
  }),
}
