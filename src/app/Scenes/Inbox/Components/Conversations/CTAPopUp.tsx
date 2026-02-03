import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Animated, Easing, View } from "react-native"

export const CTAPopUp = ({ show, children }: { show: boolean; children: React.ReactNode }) => {
  const [CTAHeight, setCTAHeight] = useState<number>(0)
  const [hidden, setHidden] = useState<boolean>(!show)
  const animationProgress = useRef(new Animated.Value(show ? 0 : 1)).current
  const viewRef = useRef<View>(null)

  useLayoutEffect(() => {
    if (!hidden) {
      viewRef.current?.measureInWindow((_x, _y, _width, height) => {
        setCTAHeight(height)
      })
    }
  }, [hidden])

  const showOrHide = (doShow: boolean) => {
    if (doShow) {
      setHidden(false)
    } else {
      setTimeout(() => setHidden(true), 250)
    }
    Animated.timing(animationProgress, {
      toValue: doShow ? 0 : 1,
      useNativeDriver: true,
      duration: 333,
      easing: Easing.in(Easing.linear),
    }).start()
  }
  useEffect(() => {
    showOrHide(show)
  }, [show])

  return hidden ? null : (
    <Animated.View
      ref={viewRef}
      style={{
        transform: [
          {
            translateY: animationProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, CTAHeight],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  )
}
