import { CameraFillIcon } from "@artsy/icons/native"
import { Button, ButtonProps } from "@artsy/palette-mobile"

interface SearchByPhotoButtonProps {
  onPress: () => void
  testID?: string
  label?: string
  /** `Button`'s own vocabulary, passed straight through -- `fillLight` for the black Lens screens. */
  variant?: ButtonProps["variant"]
}

const DEFAULT_LABEL = "Search by Photo"

const ICON_SIZE = 20

/** A `Button` with this feature's copy and icon for the Lens screens. */
export const SearchByPhotoButton: React.FC<SearchByPhotoButtonProps> = ({
  onPress,
  testID = "search-by-photo-button",
  label = DEFAULT_LABEL,
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
      {label}
    </Button>
  )
}
