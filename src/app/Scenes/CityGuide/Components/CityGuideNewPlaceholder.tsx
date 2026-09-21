import { Flex, Spinner, useScreenDimensions } from "@artsy/palette-mobile"
import { BOTTOM_TABS_HEIGHT } from "app/Navigation/AuthenticatedRoutes/Tabs"

/** Rough allowance for the header and city switcher above this section, so the spinner centers
 *  in the visible area below them, not the whole window. */
const HEADER_ALLOWANCE = 150

/**
 * Shown while `CityGuideNewQuery` loads, so the screen doesn't blank the way
 * `LoadingFallback: () => null` used to.
 */
export const CityGuideNewPlaceholder: React.FC = () => {
  const { height, safeAreaInsets } = useScreenDimensions()
  const visibleHeight = height - HEADER_ALLOWANCE - BOTTOM_TABS_HEIGHT - safeAreaInsets.bottom

  return (
    <Flex
      testID="city-guide-new-placeholder"
      width="100%"
      height={visibleHeight}
      justifyContent="center"
      alignItems="center"
    >
      <Spinner />
    </Flex>
  )
}
