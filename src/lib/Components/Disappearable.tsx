import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./StickyTabPage/reanimatedHelpers"

const springConfig = {
  ...Animated.SpringUtils.makeDefaultConfig(),
  stiffness: 600,
  damping: 120,
}

const spring = (val: Animated.Value<number>, toValue: number) => {
  return new Promise(resolve => {
    Animated.spring(val, { ...springConfig, toValue }).start(resolve)
  })
}

export interface Disappearable {
  disappear(): Promise<void>
}
export const Disappearable = React.forwardRef<Disappearable, React.PropsWithChildren<{}>>(({ children }, ref) => {
  const opacity = useAnimatedValue(1)
  const scale = useMemo(() => {
    return Animated.interpolate(opacity, {
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    })
  }, [])
  const [width, setWidth] = useState<Animated.Value<number> | null>(null)
  const [showContent, setShowContent] = useState(true)
  const isDisappearing = useRef(false)
  const onContentDidUnmount = useRef<() => void>()

  useImperativeHandle(
    ref,
    () => ({
      async disappear() {
        isDisappearing.current = true
        // first the thing fades away and shrinks a little
        await spring(opacity, 0)
        // then we remove the content to avoid reflow issues
        console.log("showcontentflase")
        await new Promise(resolve => {
          onContentDidUnmount.current = () => {
            resolve()
          }
          setShowContent(false)
        })
        console.log("did resolve")
        // then it loses its width
        if (width) {
          console.log("width zeroing")
          await spring(width, 0)
        }
      },
    }),
    []
  )

  return (
    <Animated.View
      style={{ width: width ?? undefined, opacity: 1, transform: [{ scale }], overflow: "hidden" }}
      onLayout={e => {
        if (isDisappearing.current) {
          return
        }
        if (width) {
          width.setValue(e.nativeEvent.layout.width)
        } else {
          setWidth(new Animated.Value(e.nativeEvent.layout.width))
        }
      }}
    >
      {showContent ? (
        <OnUnmount
          onUnmount={() => {
            console.log("resolving onContentDidUnmount")
            onContentDidUnmount.current?.()
          }}
        >
          {children}
        </OnUnmount>
      ) : null}
    </Animated.View>
  )
})

const OnUnmount: React.FC<{ onUnmount(): any }> = ({ children, onUnmount }) => {
  useEffect(
    () => () => {
      onUnmount()
    },
    []
  )
  return <>{children}</>
}
