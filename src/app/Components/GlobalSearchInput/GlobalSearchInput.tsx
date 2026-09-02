import { ActionType, OwnerType } from "@artsy/cohesion"
import { Flex, RoundSearchInput, Touchable } from "@artsy/palette-mobile"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { useDismissSearchOverlayOnTabBarPress } from "app/Components/GlobalSearchInput/utils/useDismissSearchOverlayOnTabBarPress"
import { SearchByPhotoIconButton } from "app/Components/SearchByPhotoButton/SearchByPhotoIconButton"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react"
import { useTracking } from "react-tracking"

export type GlobalSearchInput = {
  focus: () => void
}

interface GlobalSearchInputProps {
  ownerType: OwnerType
  onOverlayVisibilityChange?: (isVisible: boolean) => void
}

export const GlobalSearchInput = forwardRef<GlobalSearchInput, GlobalSearchInputProps>(
  ({ ownerType, onOverlayVisibilityChange }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    const debouncedIsVisible = useDebouncedValue({ value: isVisible })

    const tracking = useTracking()
    const enableArtsyLens = useExperimentFlag("onyx_artsy-lens")

    useEffect(() => {
      onOverlayVisibilityChange?.(isVisible)
      return () => onOverlayVisibilityChange?.(false)
    }, [isVisible, onOverlayVisibilityChange])

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
        <Flex>
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

          {!!enableArtsyLens && <SearchByPhotoIconButton onPress={() => navigate("/lens")} />}
        </Flex>

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
