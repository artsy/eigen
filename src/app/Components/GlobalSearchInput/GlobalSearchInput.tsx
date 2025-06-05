import { ActionType, OwnerType } from "@artsy/cohesion"
import { Flex, RoundSearchInput, Touchable } from "@artsy/palette-mobile"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { useDismissSearchOverlayOnTabBarPress } from "app/Components/GlobalSearchInput/utils/useDismissSearchOverlayOnTabBarPress"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { forwardRef, Fragment, useImperativeHandle, useState } from "react"
import { useTracking } from "react-tracking"

export type GlobalSearchInput = {
  focus: () => void
}

export const GlobalSearchInput = forwardRef<GlobalSearchInput, { ownerType: OwnerType }>(
  ({ ownerType }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    const debouncedIsVisible = useDebouncedValue({ value: isVisible })

    const tracking = useTracking()

    useDismissSearchOverlayOnTabBarPress({ isVisible, ownerType, setIsVisible })

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (!debouncedIsVisible.debouncedValue) {
          setIsVisible(true)
        }
      },
    }))

    return (
      <Fragment>
        <Touchable
          accessibilityRole="button"
          onPress={() => {
            tracking.trackEvent(
              tracks.tappedGlobalSearchBar({
                ownerType,
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
              placeholder="Search Artsy"
              accessibilityHint="Search artists, artworks, galleries etc."
              accessibilityLabel="Search artists, artworks, galleries etc."
              maxLength={55}
              numberOfLines={1}
              multiline={false}
            />
          </Flex>
        </Touchable>
        <GlobalSearchInputOverlay
          ownerType={ownerType}
          visible={isVisible}
          hideModal={() => setIsVisible(false)}
        />
      </Fragment>
    )
  }
)

const tracks = {
  tappedGlobalSearchBar: ({ ownerType }: { ownerType: OwnerType }) => ({
    action: ActionType.tappedGlobalSearchBar,
    context_screen_owner_type: ownerType,
  }),
}
