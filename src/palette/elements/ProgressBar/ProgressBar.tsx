import { noop } from "lodash"
import { Flex } from "palette"
import { useColor } from "palette/hooks"
import { Color } from "palette/Theme"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Animated } from "react-native"
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

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
  const color = useColor()
  const width = useSharedValue("0%")
  const progressAnim = useAnimatedStyle(() => ({ width: width.value }))

  const [onCompletionCalled, setOnCompletionCalled] = useState(false)

  useEffect(() => {
    const progressPercentage = clamp(progress, 0, 100)
    width.value = withTiming(`${progressPercentage}%`, { duration: 500 })

    if (progressPercentage === 100 && !onCompletionCalled) {
      onCompletion()
      setOnCompletionCalled(true)
    }
  }, [progress])

  return (
    <Flex testID="progress-bar" width="100%" backgroundColor={backgroundColor} my={1}>
      <Animated.View
        testID="progress-bar-track"
        style={[progressAnim, { height, backgroundColor: color(trackColor) }]}
      />
    </Flex>
  )
}
