import { isTablet } from "react-native-device-info"

export const truncatedTextLimit = () => (isTablet() ? 320 : 140)
