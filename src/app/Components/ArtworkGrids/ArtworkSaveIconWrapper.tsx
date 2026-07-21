import { HeartFillIcon, HeartStrokeIcon } from "@artsy/icons/native"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { memo } from "react"
import { View } from "react-native"

interface ArtworkSaveIconWrapperProps {
  isSaved: boolean
  testID?: string
  accessibilityLabel?: string
  fill?: string
}

// Memoized so it skips re-rendering the heart SVG when its (all-primitive) props are unchanged.
// In grids this component re-renders on every FlashList recycle; since most artworks are unsaved,
// the common `isSaved: false -> false` case now bails out instead of re-rendering the SVG.
export const ArtworkSaveIconWrapper = memo(function ArtworkSaveIconWrapper({
  isSaved,
  testID,
  accessibilityLabel,
  fill,
}: ArtworkSaveIconWrapperProps) {
  return (
    <View testID={testID} accessibilityLabel={accessibilityLabel}>
      {!!isSaved ? (
        <HeartFillIcon
          height={HEART_ICON_SIZE}
          width={HEART_ICON_SIZE}
          fill="blue100"
          testID="filled-heart-icon"
        />
      ) : (
        <HeartStrokeIcon
          height={HEART_ICON_SIZE}
          width={HEART_ICON_SIZE}
          fill={fill}
          testID="empty-heart-icon"
        />
      )}
    </View>
  )
})
