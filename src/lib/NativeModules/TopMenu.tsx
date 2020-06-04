import { NativeModules } from "react-native"

const { ARTopMenuModule } = NativeModules

export function getSelectedTabName() {
  return ARTopMenuModule.getSelectedTabName()
}
