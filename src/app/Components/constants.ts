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
