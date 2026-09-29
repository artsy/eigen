import { isTablet } from "react-native-device-info"

const PHONE_FULL_CARDS = 2
const MAX_TABLET_CARD_WIDTH = 150

export const getSearchRailCardWidth = (
  screenWidth: number,
  leadingPadding: number,
  trailingPadding: number,
  gap: number
) => {
  const contentWidth = screenWidth - leadingPadding - trailingPadding
  const fullCards = isTablet()
    ? Math.max(
        PHONE_FULL_CARDS,
        Math.ceil((contentWidth - MAX_TABLET_CARD_WIDTH / 2) / (MAX_TABLET_CARD_WIDTH + gap))
      )
    : PHONE_FULL_CARDS

  return (contentWidth - fullCards * gap) / (fullCards + 0.5)
}
