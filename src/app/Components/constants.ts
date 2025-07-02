import { PixelRatio } from "react-native"

export const PAGE_SIZE = 10
export const FAIR2_ARTWORKS_PAGE_SIZE = 30
export const FAIR2_EXHIBITORS_PAGE_SIZE = 10
export const SHOW2_ARTWORKS_PAGE_SIZE = 30
export const SAVED_SERCHES_PAGE_SIZE = 20
export const ALERTS_PAGE_SIZE = 10
export const HEART_ICON_SIZE = 22
/**
 * @deprecated use ACCESSIBLE_DEFAULT_ICON_SIZE instead
 */
export const DEFAULT_ICON_SIZE = 24
export const ACCESSIBLE_DEFAULT_ICON_SIZE = 24 * PixelRatio.getFontScale()
export const ICON_HIT_SLOP = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5,
}
export const BACK_BUTTON_SIZE_SIZE = 40
export const SCROLLVIEW_PADDING_BOTTOM_OFFSET = 80

// This is the default value of iOS transition duration
export const DEFAULT_SCREEN_ANIMATION_DURATION = 350
