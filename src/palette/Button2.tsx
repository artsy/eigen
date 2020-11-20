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
  const opacity = useRef(new Animated.Value(isVisibleAtStart ? 1 : 0)).current
  const scale = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(0)).current

  const { textColor, borderColor, activeBorderColor, backgroundColor, activityIndicatorColor } = getVariantColors(
    variant
  )

  const textOpacity = useRef(new Animated.Value(isLoadingAtStart ? 0 : 1)).current
  const textTranslateY = useRef(new Animated.Value(0)).current

  const activityIndicatorOpacity = useRef(new Animated.Value(isLoadingAtStart ? 1 : 0)).current
  const activityIndicatorTranslateY = useRef(new Animated.Value(0)).current

  const animatedBorderColor = useAnimatedColor(isActive ? activeBorderColor : borderColor)

  useImperativeHandle(
    ref,
    (): ButtonVariant => {
      return {
        appear() {
          this.setLoading(false, false)
          opacity.setValue(0)
          scale.setValue(0.97)
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(opacity, { toValue: 1, useNativeDriver: true, easing: Easing.ease, duration: 130 }),
              Animated.timing(scale, { toValue: 1, useNativeDriver: true, easing: Easing.ease, duration: 130 }),
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
            ]).start()
          })
        },
        setLoading(loading, animated) {
          const diff = 15
          const duration = 150
          const easing = Easing.inOut(Easing.ease)
          if (animated) {
            if (loading) {
              textOpacity.setValue(1)
              textTranslateY.setValue(0)
              activityIndicatorOpacity.setValue(0)
              activityIndicatorTranslateY.setValue(-diff)
              setTimeout(() => {
                Animated.parallel([
                  Animated.timing(textOpacity, {
                    toValue: 0,
                    useNativeDriver: true,
                    easing,
                    duration,
                  }),
                  Animated.timing(textTranslateY, {
                    toValue: diff,
                    useNativeDriver: true,
                    easing,
                    duration,
                  }),
                  Animated.timing(activityIndicatorOpacity, {
                    toValue: 1,
                    useNativeDriver: true,
                    easing,
                    duration,
                  }),
                  Animated.timing(activityIndicatorTranslateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    easing,
                    duration,
                  }),
                ]).start()
              })
            } else {
              textOpacity.setValue(0)
              textTranslateY.setValue(-diff)
              activityIndicatorOpacity.setValue(1)
              activityIndicatorTranslateY.setValue(0)

              setTimeout(() => {
                Animated.parallel([
                  Animated.timing(textOpacity, {
                    toValue: 1,
                    useNativeDriver: true,
                    easing,
                    duration,
                  }),
                  Animated.timing(textTranslateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    easing,
                    duration,
                  }),
                  Animated.timing(activityIndicatorOpacity, {
                    toValue: 0,
                    useNativeDriver: true,
                    easing,
                    duration,
                  }),
                  Animated.timing(activityIndicatorTranslateY, {
                    toValue: diff,
                    useNativeDriver: true,
                    easing,
                    duration,
                  }),
                ]).start()
              })
            }
          } else {
            textOpacity.setValue(loading ? 0 : 1)
            textTranslateY.setValue(0)

            activityIndicatorOpacity.setValue(loading ? 1 : 0)
            activityIndicatorTranslateY.setValue(0)
          }
        },
      }
    }
  )

  return (
    <StretchAbsolutely
      style={{
        opacity,
        overflow: "hidden",
        transform: [
          {
            scale,
          },
        ],
      }}
    >
      <StretchAbsolutely
        style={{
          opacity: activityIndicatorOpacity.interpolate({
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
          opacity: textOpacity,
          transform: [
            {
              translateY: textTranslateY,
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
          opacity: activityIndicatorOpacity,
          transform: [
            {
              translateY: activityIndicatorTranslateY,
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
