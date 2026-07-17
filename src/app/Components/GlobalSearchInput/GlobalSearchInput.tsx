import { ActionType, OwnerType } from "@artsy/cohesion"
import {
  Flex,
  RoundSearchInput,
  SEARCH_INPUT_CONTAINER_HEIGHT,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { useDismissSearchOverlayOnTabBarPress } from "app/Components/GlobalSearchInput/utils/useDismissSearchOverlayOnTabBarPress"
import CameraIcon from "app/Components/Icons/CameraIcon"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { forwardRef, Fragment, useImperativeHandle, useState } from "react"
import { useTracking } from "react-tracking"

export type GlobalSearchInput = {
  focus: () => void
}

export const GlobalSearchInput = forwardRef<GlobalSearchInput, { ownerType: OwnerType }>(
  ({ ownerType }, ref) => {
    const color = useColor()
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
          <Flex>
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

            {/* Camera icon on the right, mirroring RoundSearchInput's left search icon
             (same `mono60` color, 24px size and 16px horizontal padding). It's only shown
             on the resting search bar — the focused/typing overlay doesn't render it. */}
            <Flex
              position="absolute"
              right={0}
              top={0}
              height={SEARCH_INPUT_CONTAINER_HEIGHT}
              justifyContent="center"
              alignItems="center"
              px="16px"
              pointerEvents="none"
            >
              <CameraIcon
                width={24}
                height={24}
                fill={color("mono60")}
                testID="global-search-camera-icon"
              />
            </Flex>
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
