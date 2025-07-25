import { ChevronLeftIcon } from "@artsy/icons/native"
import { Flex, Text, useTheme } from "@artsy/palette-mobile"
import { FadeInLeft } from "app/utils/animations/FadeInLeft"
import { useEffect } from "react"
import { TouchableOpacity, View } from "react-native"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"

export interface AnimatableHeaderProps {
  title: string
  rightButtonDisabled?: boolean
  rightButtonText?: string
  onLeftButtonPress: () => void
  onRightButtonPress?: () => void
}

export const AnimatableHeader = (props: AnimatableHeaderProps) => {
  const { title, rightButtonDisabled, rightButtonText, onRightButtonPress } = props
  const { space, color } = useTheme()
  const { headerHeight, setTitle, titleShown } = useAnimatableHeaderContext()

  useEffect(() => {
    setTitle(title)
  }, [title])

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: space(2),
        alignItems: "center",
        height: headerHeight,
        backgroundColor: color("background"),
      }}
    >
      <TouchableOpacity
        hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
        onPress={props.onLeftButtonPress}
        accessibilityLabel="Header back button"
      >
        <ChevronLeftIcon fill="mono100" mt="2px" />
      </TouchableOpacity>

      <Flex
        flex={1}
        height={headerHeight}
        justifyContent="center"
        ml={`${space(0.5) + space(1)}px`}
      >
        <FadeInLeft show={titleShown}>
          <Text testID="animated-header-title" variant="sm" numberOfLines={2}>
            {title}
          </Text>
        </FadeInLeft>
      </Flex>

      {!!onRightButtonPress && !!rightButtonText && (
        <TouchableOpacity
          accessibilityRole="button"
          hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
          onPress={onRightButtonPress}
          disabled={rightButtonDisabled}
        >
          <Text
            variant="sm"
            style={{ textDecorationLine: "underline" }}
            color={rightButtonDisabled ? "mono60" : "mono100"}
          >
            {rightButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
