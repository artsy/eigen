import { ArrowLeftIcon, Flex, Text, useTheme } from "palette"
import { useEffect } from "react"
import { TouchableOpacity } from "react-native"
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated"
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
  const { space } = useTheme()
  const { headerHeight, setTitle, titleShown } = useAnimatableHeaderContext()

  useEffect(() => {
    setTitle(title)
  }, [title])

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        paddingHorizontal: space("2"),
        alignItems: "center",
        height: headerHeight,
        backgroundColor: "white",
      }}
    >
      <TouchableOpacity
        hitSlop={{ top: space("1"), bottom: space("1"), left: space("1"), right: space("1") }}
        onPress={props.onLeftButtonPress}
        accessibilityLabel="Header back button"
      >
        <ArrowLeftIcon fill="black100" mt="2px" />
      </TouchableOpacity>

      <Flex flex={1} height={headerHeight} justifyContent="center" ml={space("0.5") + space("1")}>
        {!!titleShown && (
          <Animated.View entering={FadeInLeft} exiting={FadeOutLeft}>
            <Text testID="animated-header-title" variant="sm" numberOfLines={2}>
              {title}
            </Text>
          </Animated.View>
        )}
      </Flex>

      {!!onRightButtonPress && !!rightButtonText && (
        <TouchableOpacity
          hitSlop={{ top: space("1"), bottom: space("1"), left: space("1"), right: space("1") }}
          onPress={onRightButtonPress}
          disabled={rightButtonDisabled}
        >
          <Text
            variant="sm"
            style={{ textDecorationLine: "underline" }}
            color={rightButtonDisabled ? "black30" : "black100"}
          >
            {rightButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  )
}
