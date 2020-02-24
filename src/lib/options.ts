import { NativeModules } from "react-native"
const { Emission } = NativeModules

// These features are available in the JS runtime,
// they can either come in as AROptions inside the Emission app, or Eigen
// or as Echo features inside Eigen.

// You can find out more in docs/adding_a_lab_option.md

/**
 * Options that get passed down from the native host application
 */
export interface AvailableOptions {
  /** Hide the consignments flag from the home screen? */
  hideConsignmentsSash: boolean
}

export const options: AvailableOptions = Emission.options
