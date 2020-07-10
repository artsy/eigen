import { State } from "easy-peasy"
import { BottomTabsModel } from "lib/Scenes/BottomTabs/BottomTabsModel"
import { NativeModel } from "./NativeModel"

// Eventually this file will mostly will be pulling in global state modules from other parts of the app
export interface AppStoreModel {
  native: NativeModel
  bottomTabs: BottomTabsModel
}

export const appStoreModel: AppStoreModel = {
  native: NativeModel,
  bottomTabs: BottomTabsModel,
}

export type AppStoreState = State<AppStoreModel>
