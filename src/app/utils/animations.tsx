import { AnimatePresence, View, View as MotiView, useDynamicAnimation } from "moti"
import React, { useState, useEffect, useRef } from "react"

export const FadeInLeft: React.FC<{ show: boolean }> = ({ children, show }) => {
  return (
    <AnimatePresence>
      {!!show && (
        <View
          from={{
            translateX: -10,
            opacity: 0,
          }}
          animate={{
            translateX: 0,
            opacity: 1,
          }}
          exit={{
            translateX: -10,
            opacity: 0,
          }}
        >
          {children}
        </View>
      )}
    </AnimatePresence>
  )
}

type AnimateHeightProps = {
  children?: React.ReactNode
  enterFrom?: "bottom" | "top"
  initialHeight?: number
} & React.ComponentProps<typeof MotiView>

export const AnimateHeight: React.FC<AnimateHeightProps> = ({
  children,
  animate = {},
  transition = {
    type: "spring",
    damping: 16,
    mass: 1.2,
  },
  initialHeight = 100,
}) => {
  const animation = useDynamicAnimation(() => ({
    height: initialHeight,
  }))
  const [height, setHeight] = useState(initialHeight)

  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (animation.current?.height == height) {
      return
    }

    animation.animateTo({
      height,
    })
  }, [animation, height])

  return (
    <MotiView state={animation} transition={transition}>
      <MotiView
        animate={{ ...animate, opacity: !height ? 0 : 1 }}
        transition={transition}
        onLayout={(next) => {
          if (mounted.current) {
            setHeight(next.nativeEvent.layout.height)
          }
        }}
      >
        {children}
      </MotiView>
    </MotiView>
  )
}
