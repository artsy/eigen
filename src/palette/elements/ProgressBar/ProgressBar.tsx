import { noop } from "lodash"
import { Flex } from "palette"
import { useColor } from "palette/hooks"
import { Color } from "palette/Theme"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Animated } from "react-native"

export interface ProgressBarProps {
  progress: number
  height?: number
  trackColor?: Color
  backgroundColor?: Color
  onCompletion?: () => void
}

const clamp = (num: number, min: number, max: number) => Math.max(min, Math.min(num, max))

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 2,
  trackColor = "blue100",
  backgroundColor = "black30",
  onCompletion = noop,
}) => {
  const progressPercentage = clamp(progress, 0, 100)

  const widthRef = useRef<Animated.Value>(new Animated.Value(0))

  const [onCompletionCalled, setOnCompletionCalled] = useState(false)

  const animate = useCallback(() => {
    Animated.timing(widthRef.current, {
      duration: 500,
      toValue: progressPercentage,
      useNativeDriver: false,
    }).start(() => {
      if (progressPercentage === 100 && !onCompletionCalled) {
        onCompletion()
        setOnCompletionCalled(true)
      }
    })
  }, [progressPercentage])

  useEffect(() => {
    animate()
  }, [progressPercentage])

  const inputRange = [...Array(101).keys()]
  const outputRange = inputRange.map((i) => i + "%")

  return (
    <Flex testID="progress-bar" width="100%" backgroundColor={backgroundColor} my={1}>
      <Animated.View
        testID="progress-bar-track"
        style={{
          height,
          backgroundColor: useColor()(trackColor),
          width: widthRef.current.interpolate({
            inputRange,
            outputRange,
          }),
        }}
      />
    </Flex>
  )
}
