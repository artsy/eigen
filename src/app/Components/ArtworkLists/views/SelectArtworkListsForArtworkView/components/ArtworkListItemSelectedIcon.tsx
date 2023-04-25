import { CheckCircleIcon } from "@artsy/palette-mobile"

interface ArtworkListItemSelectedIconProps {
  selected: boolean
}

const ICON_SIZE = 24

export const ArtworkListItemSelectedIcon = ({ selected }: ArtworkListItemSelectedIconProps) => {
  if (selected) {
    return (
      <CheckCircleIcon
        width={ICON_SIZE}
        height={ICON_SIZE}
        accessibilityState={{ selected: true }}
      />
    )
  }

  return null
}
