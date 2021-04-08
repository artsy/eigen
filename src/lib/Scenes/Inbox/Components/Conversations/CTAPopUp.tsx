import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing } from "react-native"

export const CTAPopUp = ({ show, children }: { show: boolean; children: JSX.Element }) => {
  const [CTAHeight, setCTAHeight] = useState<number>(0)
  const [hidden, setHidden] = useState<boolean>(!show)
  const animationProgress = useRef(new Animated.Value(show ? 0 : 1)).current

  const showOrHide = (doShow: boolean) => {
    if (doShow) {
      setHidden(false)
    } else {
      setTimeout(() => setHidden(true), 225)
    }
    Animated.timing(animationProgress, {
      toValue: doShow ? 0 : 1,
      useNativeDriver: true,
      // ease-out to blend nicely with keyboard animation
      duration: 250,
      easing: Easing.in(Easing.linear),
      // easing: Easing.out(Easing.linear),
      // easing: Easing.linear,
    }).start()
  }
  useEffect(() => {
    showOrHide(show)
  }, [show])

  return hidden ? null : (
    <Animated.View
      onLayout={({ nativeEvent }) => {
        setCTAHeight(nativeEvent.layout.height)
      }}
      style={{
        backgroundColor: "cyan",
        transform: [
          {
            translateY: animationProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, CTAHeight!],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  )
}
