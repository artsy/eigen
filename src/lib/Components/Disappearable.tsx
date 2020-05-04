import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { LayoutAnimation, LayoutChangeEvent, View } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./StickyTabPage/reanimatedHelpers"

const spring = (val: Animated.Value<number>, props: { toValue: number }) => {
  return new Promise(resolve => {
    Animated.spring(val, {
      ...Animated.SpringUtils.makeDefaultConfig(),
      stiffness: 800,
      damping: 320,
      ...props,
      restSpeedThreshold: 0.1,
    }).start(resolve)
  })
}

export interface Disappearable {
  disappear(): Promise<void>
}
export const Disappearable = React.forwardRef<Disappearable, React.PropsWithChildren<{ horizontal?: boolean }>>(
  ({ children, horizontal }, ref) => {
    const opacity = useAnimatedValue(1)
    const scale = useMemo(() => {
      return Animated.interpolate(opacity, {
        inputRange: [0, 1],
        outputRange: [0.92, 1],
      })
    }, [])
    const [containerSize, setContainerSize] = useState<number | undefined>()
    const [showContent, setShowContent] = useState(true)
    const isDisappearing = useRef(false)
    const onContentDidUnmount = useRef<() => void>()

    useImperativeHandle(
      ref,
      () => ({
        async disappear() {
          isDisappearing.current = true
          // first the thing fades away and shrinks a little
          await spring(opacity, { toValue: 0 })
          // then we remove the content to avoid reflow issues
          await new Promise(resolve => {
            onContentDidUnmount.current = () => {
              resolve()
            }
            setShowContent(false)
          })
          // then it loses its width
          await new Promise(resolve => {
            LayoutAnimation.configureNext(LayoutAnimation.create(210, "easeIn"), resolve)
            setContainerSize(0)
          })
        },
      }),
      []
    )

    return (
      <Animated.View
        style={[
          { opacity, transform: [{ scale }], overflow: "hidden" },
          horizontal ? { width: containerSize } : { height: containerSize },
        ]}
      >
        {showContent ? (
          <ContentWrapper
            onUnmount={() => {
              onContentDidUnmount.current?.()
            }}
            onLayout={e => {
              if (isDisappearing.current) {
                return
              }
              setContainerSize(e.nativeEvent.layout.width)
            }}
          >
            {children}
          </ContentWrapper>
        ) : null}
      </Animated.View>
    )
  }
)

const ContentWrapper: React.FC<{ onUnmount(): any; onLayout(e: LayoutChangeEvent): any }> = ({
  children,
  onUnmount,
  onLayout,
}) => {
  useEffect(
    () => () => {
      onUnmount()
    },
    []
  )
  return <View onLayout={onLayout}>{children}</View>
}
