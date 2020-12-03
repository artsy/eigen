import { screen } from "lib/data/ScreenSizes/screenSizes"
import { Dimensions } from "react-native"

const { height } = Dimensions.get("window")
export const isSmallScreen = screen(height) === "small"
