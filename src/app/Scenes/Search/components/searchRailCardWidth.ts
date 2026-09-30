import { isTablet } from "react-native-device-info"

const PHONE_FULL_CARDS = 2
const DEFAULT_MAX_TABLET_CARD_WIDTH = 150

export const getSearchRailCardWidth = (
  screenWidth: number,
  leadingPadding: number,
  trailingPadding: number,
  gap: number,
  maxTabletCardWidth = DEFAULT_MAX_TABLET_CARD_WIDTH
) => {
  const contentWidth = screenWidth - leadingPadding - trailingPadding
  const fullCards = isTablet()
    ? Math.max(
        PHONE_FULL_CARDS,
        Math.ceil((contentWidth - maxTabletCardWidth / 2) / (maxTabletCardWidth + gap))
      )
    : PHONE_FULL_CARDS

  return (contentWidth - fullCards * gap) / (fullCards + 0.5)
}
