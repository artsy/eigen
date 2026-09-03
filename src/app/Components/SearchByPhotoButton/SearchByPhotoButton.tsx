import { CameraFillIcon } from "@artsy/icons/native"
import { Button, ButtonProps } from "@artsy/palette-mobile"
import { PixelRatio } from "react-native"

interface SearchByPhotoButtonProps {
  onPress: () => void
  testID?: string
  /** `Button`'s own vocabulary, passed straight through -- `fillLight` for the black Lens screens. */
  variant?: ButtonProps["variant"]
}

const LABEL = "Search by photo"

const ICON_SIZE = 20

/**
 * Room a pinned pill needs, so scroll containers underneath can pad their last item clear of it.
 * Tracks `Button`'s own `size="large"` height, which scales with the system font, plus the 10pt of
 * `pb={1}` its callers pin it with.
 */
export const SEARCH_BY_PHOTO_BUTTON_SPACE = 50 * PixelRatio.getFontScale() + 10

/** A `Button` with this feature's copy and icon, so its three call sites don't repeat them. */
export const SearchByPhotoButton: React.FC<SearchByPhotoButtonProps> = ({
  onPress,
  testID = "search-by-photo-button",
  variant = "fillDark",
}) => {
  return (
    <Button
      block
      size="large"
      variant={variant}
      icon={<CameraFillIcon width={ICON_SIZE} height={ICON_SIZE} />}
      textVariant="sm-display"
      onPress={onPress}
      testID={testID}
    >
      {LABEL}
    </Button>
  )
}
