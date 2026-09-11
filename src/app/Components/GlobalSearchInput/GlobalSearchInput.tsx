import { ActionType, ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  RoundSearchInput,
  SEARCH_INPUT_CONTAINER_BORDER_RADIUS,
  SEARCH_INPUT_CONTAINER_HEIGHT,
  Touchable,
} from "@artsy/palette-mobile"
import { GlobalSearchInputOverlay } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlay"
import { useDismissSearchOverlayOnTabBarPress } from "app/Components/GlobalSearchInput/utils/useDismissSearchOverlayOnTabBarPress"
import {
  SEARCH_BY_PHOTO_ICON_CONTAINER_WIDTH,
  SearchByPhotoIconButton,
} from "app/Components/SearchByPhotoButton/SearchByPhotoIconButton"
import { tappedSearchByImage } from "app/Components/SearchByPhotoButton/tracks"
import { ICON_HIT_SLOP } from "app/Components/constants"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useEnableArtsyLens } from "app/utils/hooks/useEnableArtsyLens"
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react"
import { useTracking } from "react-tracking"

export type GlobalSearchInput = {
  focus: () => void
}

interface GlobalSearchInputProps {
  ownerType: ScreenOwnerType
  onOverlayVisibilityChange?: (isVisible: boolean) => void
}

export const GlobalSearchInput = forwardRef<GlobalSearchInput, GlobalSearchInputProps>(
  ({ ownerType, onOverlayVisibilityChange }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    const debouncedIsVisible = useDebouncedValue({ value: isVisible })

    const tracking = useTracking()
    const enableArtsyLens = useEnableArtsyLens()

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
        <Flex
          backgroundColor="mono5"
          borderRadius={SEARCH_INPUT_CONTAINER_BORDER_RADIUS}
          flexDirection="row"
        >
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
            style={{ flex: 1 }}
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

          {!!enableArtsyLens && (
            <Flex
              alignItems="center"
              height={SEARCH_INPUT_CONTAINER_HEIGHT}
              justifyContent="center"
              width={SEARCH_BY_PHOTO_ICON_CONTAINER_WIDTH}
            >
              <SearchByPhotoIconButton
                onPress={() => {
                  tracking.trackEvent(
                    tappedSearchByImage({
                      contextModule: ContextModule.header,
                      contextScreenOwnerType: ownerType,
                      type: "search_input_icon",
                    })
                  )
                  navigate("/lens")
                }}
              />
            </Flex>
          )}
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
  tappedGlobalSearchBar: ({ ownerType }: { ownerType: ScreenOwnerType }) => ({
    action: ActionType.tappedGlobalSearchBar,
    context_screen_owner_type: ownerType,
  }),
}
