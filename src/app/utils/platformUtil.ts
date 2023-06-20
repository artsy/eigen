import { Platform } from "react-native"

export const osMajorVersion = () => {
  // eslint-disable-next-line no-constant-condition
  if (typeof (Platform.Version === "string")) {
    return parseInt(Platform.Version as string, 10)
  } else {
    return Platform.Version as number
  }
}
