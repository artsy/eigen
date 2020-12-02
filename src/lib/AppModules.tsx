import { BottomTabType } from "./Scenes/BottomTabs/BottomTabType"
import { Consignments } from "./Scenes/Consignments"
import { ConsignmentsSubmissionForm } from "./Scenes/Consignments/ConsignmentsHome/ConsignmentsSubmissionForm"
import { MyAccountQueryRenderer } from "./Scenes/MyAccount/MyAccount"
import { MyAccountEditEmailQueryRenderer } from "./Scenes/MyAccount/MyAccountEditEmail"
import { MyProfileQueryRenderer } from "./Scenes/MyProfile/MyProfile"
import { PrivacyRequest } from "./Scenes/PrivacyRequest"

export interface ViewOptions {
  modalPresentationStyle?: "fullScreen" | "pageSheet" | "formSheet"
  hasOwnModalCloseButton?: boolean
  alwaysPresentModally?: boolean
  hidesBackButton?: boolean
  fullBleed?: boolean
  // If this module is the root view of a particular tab, name it here
  isRootViewForTabName?: BottomTabType
  // If this module should only be shown in one particular tab, name it here
  onlyShowInTabName?: BottomTabType
}

type ModuleDescriptor =
  | {
      type: "react"
      Component: React.ComponentType<any>
      options: ViewOptions
    }
  | {
      type: "native"
      options: ViewOptions
    }

export function reactModule(Component: React.ComponentType<any>, options: ViewOptions = {}): ModuleDescriptor {
  return { type: "react", options, Component }
}

export function nativeModule(options: ViewOptions = {}): ModuleDescriptor {
  return { type: "native", options }
}

// little helper function to make sure we get both intellisense and good type information on the result
export function defineModules<T extends string>(obj: Record<T, ModuleDescriptor>) {
  return obj
}

export const safeModules = defineModules({
  MyProfile: reactModule(MyProfileQueryRenderer, { isRootViewForTabName: "profile" }),
  PrivacyRequest: reactModule(PrivacyRequest),
  MyAccount: reactModule(MyAccountQueryRenderer),
  MyAccountEditEmail: reactModule(MyAccountEditEmailQueryRenderer, { hidesBackButton: true }),
  Sales: reactModule(Consignments, { isRootViewForTabName: "sell" }),
  ConsignmentsSubmissionForm: reactModule(ConsignmentsSubmissionForm, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
  }),
})

export type SafeAppModule = keyof typeof safeModules
