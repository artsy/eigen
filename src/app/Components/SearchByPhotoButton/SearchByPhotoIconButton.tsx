import { PhotographIcon } from "@artsy/icons/native"
import { Touchable } from "@artsy/palette-mobile"
import { ICON_HIT_SLOP } from "app/Components/constants"

interface SearchByPhotoIconButtonProps {
  onPress: () => void
  testID?: string
}

/**
 * The compact form of the Artsy Lens entry point: the camera icon that sits at the right edge of a
 * `RoundSearchInput`. The pill (`SearchByPhotoButton`) is the labelled version of the same action.
 *
 * Positions itself absolutely, so it must be rendered as a sibling *after* the `RoundSearchInput`
 * inside a wrapper with **no horizontal padding** — Yoga measures absolute insets from the parent's
 * border box and ignores its padding, so under a padded wrapper the icon would drift out past the
 * input's own edge by that padding. `right: 16` matches palette's `CONTAINER_HORIZONTAL_PADDING`,
 * mirroring the search icon on the opposite end.
 *
 * `hitSlop` is the shared icon slop rather than palette's `DEFAULT_HIT_SLOP` (20 on every side):
 * this icon overlays a bar that is itself tappable, so a generous slop would quietly steal taps
 * meant for the input.
 */
export const SearchByPhotoIconButton: React.FC<SearchByPhotoIconButtonProps> = ({
  onPress,
  testID = "search-input-camera-icon",
}) => {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel="Search by photo"
      onPress={onPress}
      hitSlop={ICON_HIT_SLOP}
      haptic="impactLight"
      testID={testID}
      style={{
        position: "absolute",
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: "center",
      }}
    >
      <PhotographIcon width={20} height={20} fill="mono100" />
    </Touchable>
  )
}
