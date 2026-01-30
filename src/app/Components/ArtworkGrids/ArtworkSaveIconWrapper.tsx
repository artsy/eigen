import { HeartFillIcon, HeartStrokeIcon } from "@artsy/icons/native"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { View } from "react-native"

interface ArtworkSaveIconWrapperProps {
  isSaved: boolean
  testID?: string
  accessibilityLabel?: string
  fill?: string
}

export const ArtworkSaveIconWrapper: React.FC<ArtworkSaveIconWrapperProps> = ({
  isSaved,
  testID,
  accessibilityLabel,
  fill,
}) => {
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
}
