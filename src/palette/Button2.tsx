import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import { ActivityIndicator, Animated, Easing, View } from "react-native"
import { Text, TouchableWithScale } from "./elements"
import { color } from "./helpers"

type Variant = "primary" | "secondary"

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

function useAnimatedColor(nextColor: string) {
  const nextDrivingValue = useRef(1)
  const driver = useRef(new Animated.Value(0)).current
  const [interpolationConfig, setInterpolationConfig] = useState({
    inputRange: [-1, 0],
    outputRange: [nextColor, nextColor],
  })
  const prevColor = usePrevious(nextColor)

  useEffect(() => {
    if (nextColor !== prevColor) {
      setInterpolationConfig(({ inputRange, outputRange }) => ({
        inputRange: [...inputRange, nextDrivingValue.current],
        outputRange: [...outputRange, nextColor],
      }))
      setTimeout(() => {
        Animated.timing(driver, {
          easing: Easing.ease,
          duration: 100,
          useNativeDriver: false,
          toValue: nextDrivingValue.current,
        }).start()
        nextDrivingValue.current++
      }, 20)
    }
  }, [nextColor])

  return driver.interpolate(interpolationConfig)
}

export const Button2: React.FC<{
  loading: boolean
  states: { [key: string]: { variant: Variant; label: string } }
  currentState: string
  onPress(): void
}> = (props) => {
  const prevProps = usePrevious(props)
  const variantRefs = useRef<Record<string, ButtonVariant | null>>({}).current

  useEffect(() => {
    if (props.currentState !== prevProps.currentState) {
      variantRefs[prevProps.currentState]?.disappear()
      variantRefs[props.currentState]?.appear()
    } else if (props.loading !== prevProps.loading) {
      variantRefs[props.currentState]?.setLoading(props.loading, true)
    }
  }, [props])

  const [isActive, setIsActive] = useState(false)

  return (
    <TouchableWithScale
      disabled={props.loading}
      onPress={() => {
        props.onPress?.()
      }}
      onPressIn={() => {
        setIsActive(true)
      }}
      onPressOut={() => {
        setIsActive(false)
      }}
      style={{ height: 40 }}
    >
      {Object.keys(props.states)
        .filter((k) => k !== props.currentState)
        .concat([props.currentState])
        .map((k) => {
          return (
            <ButtonVariant
              ref={(ref) => {
                variantRefs[k] = ref
              }}
              key={k}
              variant={props.states[k].variant}
              isLoadingAtStart={k === props.currentState ? props.loading : false}
              isVisibleAtStart={k === props.currentState}
              isActive={k === props.currentState && isActive}
            >
              {props.states[k].label}
            </ButtonVariant>
          )
        })}
    </TouchableWithScale>
  )
}

interface ButtonVariant {
  appear(): void
  disappear(): void
  setLoading(loading: boolean, animated: boolean): void
}
const ButtonVariant = React.forwardRef<
  ButtonVariant,
  React.PropsWithChildren<{
    isVisibleAtStart: boolean
    isLoadingAtStart: boolean
    variant: Variant
    isActive: boolean
  }>
>(({ variant, children, isVisibleAtStart, isLoadingAtStart, isActive }, ref) => {
  const activityIndicatorEntrance = useRef(new Animated.Value(isLoadingAtStart ? 1 : 0)).current
  const opacity = useRef(new Animated.Value(isVisibleAtStart ? 1 : 0)).current
  const scale = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(0)).current

  const { textColor, borderColor, activeBorderColor, backgroundColor, activityIndicatorColor } = getVariantColors(
    variant
  )

  const animatedBorderColor = useAnimatedColor(isActive ? activeBorderColor : borderColor)

  useImperativeHandle(
    ref,
    (): ButtonVariant => {
      return {
        appear() {
          this.setLoading(false, false)
          opacity.setValue(0)
          scale.setValue(0.97)
          translateY.setValue(-7)
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(opacity, { toValue: 1, useNativeDriver: true, easing: Easing.ease, duration: 130 }),
              Animated.timing(scale, { toValue: 1, useNativeDriver: true, easing: Easing.ease, duration: 130 }),
              Animated.timing(translateY, { toValue: 0, useNativeDriver: true, easing: Easing.ease, duration: 110 }),
            ]).start()
          })
        },
        disappear() {
          opacity.setValue(1)
          scale.setValue(1)
          translateY.setValue(0)
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(opacity, { toValue: 0, useNativeDriver: true, easing: Easing.ease, duration: 130 }),
              Animated.timing(scale, { toValue: 0.9, useNativeDriver: true, easing: Easing.ease, duration: 130 }),
              Animated.timing(translateY, { toValue: 5, useNativeDriver: true, easing: Easing.ease, duration: 150 }),
            ]).start()
          })
        },
        setLoading(loading, animated) {
          if (animated) {
            Animated.timing(activityIndicatorEntrance, {
              easing: Easing.ease,
              duration: 120,
              toValue: loading ? 1 : 0,
              useNativeDriver: true,
            }).start()
          } else {
            activityIndicatorEntrance.setValue(loading ? 1 : 0)
          }
        },
      }
    }
  )

  return (
    <StretchAbsolutely
      style={{
        opacity,
        transform: [
          // {
          //   scale,
          // },
          { translateY },
        ],
      }}
    >
      <StretchAbsolutely
        style={{
          opacity: activityIndicatorEntrance.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.7],
          }),
        }}
      >
        <StretchAbsolutely
          style={{
            backgroundColor,
            borderColor: animatedBorderColor,
            borderWidth: 1,
            borderRadius: 2,
            overflow: "hidden",
          }}
        ></StretchAbsolutely>
      </StretchAbsolutely>
      <StretchAbsolutely
        pointerEvents="none"
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: activityIndicatorEntrance.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          transform: [
            {
              scale: activityIndicatorEntrance.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.85],
              }),
            },
          ],
        }}
      >
        <Text variant="mediumText" color={textColor} textAlign="center">
          {children}
        </Text>
      </StretchAbsolutely>
      <StretchAbsolutely
        pointerEvents="none"
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: activityIndicatorEntrance,
          transform: [
            {
              scale: activityIndicatorEntrance.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ],
        }}
      >
        <ActivityIndicator color={activityIndicatorColor} />
      </StretchAbsolutely>
    </StretchAbsolutely>
  )
})

const StretchAbsolutely: typeof Animated.View = ({ style, ...others }) => {
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        style,
      ]}
      {...(others as any)}
    />
  )
}

function getVariantColors(
  variant: Variant
): {
  textColor: string
  borderColor: string
  activeBorderColor: string
  backgroundColor: string
  activityIndicatorColor: string
} {
  if (variant === "primary") {
    return {
      activeBorderColor: "black",
      textColor: "white",
      borderColor: "black",
      backgroundColor: "black",
      activityIndicatorColor: "white",
    }
  } else {
    return {
      textColor: "black",
      borderColor: color("black10"),
      activeBorderColor: color("black60"),
      backgroundColor: "white",
      activityIndicatorColor: "black",
    }
  }
}
