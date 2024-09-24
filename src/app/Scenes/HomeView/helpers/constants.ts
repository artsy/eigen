import { isTablet } from "react-native-device-info"

export const HORIZONTAL_FLATLIST_WINDOW_SIZE = isTablet() ? 10 : 5
export const HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT = isTablet() ? 10 : 3
