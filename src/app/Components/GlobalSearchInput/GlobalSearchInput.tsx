import { ActionType, ContextModule } from "@artsy/cohesion"
import { Flex, RoundSearchInput, Touchable } from "@artsy/palette-mobile"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { SEARCH_INPUT_PLACEHOLDER } from "app/Scenes/Search/Search"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import { Fragment, useState } from "react"
import { useTracking } from "react-tracking"

export const GlobalSearchInput: React.FC<{}> = () => {
  const [isVisible, setIsVisible] = useState(false)
  const tracking = useTracking()
  const selectedTab = useSelectedTab()

  return (
    <Fragment>
      <Touchable
        onPress={() => {
          tracking.trackEvent(
            tracks.tappedGlobalSearchBar({
              contextModule: selectedTab as ContextModule,
            })
          )
          setIsVisible(true)
        }}
        hitSlop={ICON_HIT_SLOP}
        testID="search-button"
      >
        {/* In order to make the search input behave like a button here, we wrapped it with a
         Touchable and set pointerEvents to none. This will prevent the input from receiving
         touch events and make sure they are being handled by the Touchable.
        */}
        <Flex pointerEvents="none">
          <RoundSearchInput
            placeholder={SEARCH_INPUT_PLACEHOLDER}
            accessibilityHint="Search artists, artworks, galleries etc."
            accessibilityLabel="Search artists, artworks, galleries etc."
            maxLength={55}
            numberOfLines={1}
            multiline={false}
          />
        </Flex>
      </Touchable>
      <GlobalSearchInputOverlay visible={isVisible} hideModal={() => setIsVisible(false)} />
    </Fragment>
  )
}

const tracks = {
  tappedGlobalSearchBar: ({ contextModule }: { contextModule: ContextModule }) => ({
    action: ActionType.tappedGlobalSearchBar,
    context_module: contextModule,
  }),
}
