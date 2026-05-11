import { isTablet } from "react-native-device-info"

export const defaultScreenOrientation = !isTablet() ? "portrait" : "default"
