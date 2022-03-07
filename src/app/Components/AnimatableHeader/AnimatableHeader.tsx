import { ArrowLeftIcon, Text, useTheme } from "palette"
import React, { useEffect, useRef } from "react"
import { TouchableOpacity } from "react-native"
import Animated, {
  and,
  block,
  Clock,
  cond,
  Easing,
  eq,
  Extrapolate,
  greaterOrEq,
  neq,
  set,
  startClock,
  stopClock,
  timing,
  useCode,
} from "react-native-reanimated"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"

export interface AnimatableHeaderProps {
  title: string
  rightButtonDisabled?: boolean
  rightButtonText?: string
  onLeftButtonPress: () => void
  onRightButtonPress?: () => void
}

// Constants
const ANIMATION_DURATION = 400
const SMALL_TITLE_LEFT_OFFSET = -15

const runTiming = (clock: Clock, value: Animated.Value<number>) => {
  const state = {
    finished: new Animated.Value(0),
    position: new Animated.Value(0),
    time: new Animated.Value(0),
    frameTime: new Animated.Value(0),
  }

  const config = {
    duration: ANIMATION_DURATION,
    toValue: new Animated.Value(0),
    easing: Easing.inOut(Easing.ease),
  }

  return block([
    cond(and(eq(value, 1), neq(config.toValue, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(value, 0), neq(config.toValue, 0)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    // we run the step here that is going to update position
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    // we made the block return the updated position
    state.position,
  ])
}

export const AnimatableHeader: React.FC<AnimatableHeaderProps> = (props) => {
  const { title, rightButtonDisabled, rightButtonText, onRightButtonPress } = props
  const { space } = useTheme()
  const { scrollOffsetY, headerHeight, largeTitleHeight, largeTitleEndEdge, setTitle } =
    useAnimatableHeaderContext()
  const clock = useRef(new Animated.Clock()).current
  const value = useRef(new Animated.Value(0)).current
  const opacity = useRef(runTiming(clock, value)).current
  const translateX = Animated.interpolate(opacity, {
    inputRange: [0, 1],
    outputRange: [SMALL_TITLE_LEFT_OFFSET, 0],
    extrapolate: Extrapolate.CLAMP,
  })

  useCode(
    () => [
      cond(neq(largeTitleHeight, -1), [
        cond(greaterOrEq(scrollOffsetY, largeTitleEndEdge), set(value, 1), set(value, 0)),
      ]),
    ],
    []
  )

  useEffect(() => {
    setTitle(title)
  }, [title])

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        paddingHorizontal: space(2),
        alignItems: "center",
        height: headerHeight,
        backgroundColor: "white",
      }}
    >
      <TouchableOpacity
        hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
        onPress={props.onLeftButtonPress}
        accessibilityLabel="Header back button"
      >
        <ArrowLeftIcon fill="black100" mt="2px" />
      </TouchableOpacity>
      <Animated.View
        pointerEvents="none"
        style={{
          flex: 1,
          justifyContent: "center",
          height: headerHeight,
          marginLeft: space(0.5) + space(1),
          opacity,
          transform: [{ translateX }],
        }}
      >
        <Text variant="sm" numberOfLines={2}>
          {title}
        </Text>
      </Animated.View>
      {!!onRightButtonPress && !!rightButtonText && (
        <TouchableOpacity
          hitSlop={{ top: space(1), bottom: space(1), left: space(1), right: space(1) }}
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
