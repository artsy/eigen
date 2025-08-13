import { ChevronLeftIcon } from "@artsy/icons/native"
import { Box, useTheme, Text, Separator } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"

export interface ArtworkFilterBackHeaderProps {
  title: string
  rightButtonText?: string
  rightButtonAccessibilityLabel?: string
  onLeftButtonPress: () => void
  onRightButtonPress?: () => void
}

export const ArtworkFilterBackHeader: React.FC<ArtworkFilterBackHeaderProps> = (props) => {
  const {
    title,
    rightButtonText,
    rightButtonAccessibilityLabel = "Header right button",
    onLeftButtonPress,
    onRightButtonPress,
  } = props
  const { space } = useTheme()

  return (
    <>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        height={space(6)}
        px={2}
      >
        <TouchableOpacity
          onPress={onLeftButtonPress}
          testID="artwork-filter-header-back-button"
          hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
          accessibilityLabel="Header back button"
          style={{ paddingRight: space(0.5) }}
        >
          <ChevronLeftIcon fill="mono100" />
        </TouchableOpacity>
        <Box flex={1} ml={1} mr={2}>
          <Text variant="sm-display" numberOfLines={2} lineHeight="18px">
            {title}
          </Text>
        </Box>
        {!!onRightButtonPress && !!rightButtonText && (
          <TouchableOpacity
            onPress={onRightButtonPress}
            hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
            accessibilityLabel={rightButtonAccessibilityLabel}
          >
            <Text variant="sm" style={{ textDecorationLine: "underline" }}>
              {rightButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </Box>
      <Separator />
    </>
  )
}
