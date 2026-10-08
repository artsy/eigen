import { useColor } from "@artsy/palette-mobile"
import React, { useEffect, useState } from "react"
import { LayoutChangeEvent, StyleSheet, View } from "react-native"
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"
import { Path, Svg } from "react-native-svg"

const TRACE_DURATION = 4500

/** How long the comet takes to fade away once it has completed its trace. */
const FADE_DURATION = 600

/** Width of the traced ring, drawn just outside the pill's own edge. */
const RING_WIDTH = 1

/**
 * The comet as colour bands, each spanning `from`-`to` as a fraction of a full turn, clockwise
 * from its sharp edge: mostly dark blue, fading through lighter blues to the resting outline.
 */
const BANDS = [
  { color: "#1023D7", from: 0, to: 0.65 },
  { color: "#2A3BDB", from: 0.65, to: 0.695 },
  { color: "#4150DE", from: 0.695, to: 0.73 },
  { color: "#5966E1", from: 0.73, to: 0.765 },
  { color: "#707BE5", from: 0.765, to: 0.8 },
  { color: "#8891E8", from: 0.8, to: 0.835 },
  { color: "#9FA6EB", from: 0.835, to: 0.87 },
  { color: "#B7BCEE", from: 0.87, to: 0.905 },
  { color: "#CED1F2", from: 0.905, to: 0.94 },
  { color: "#E6E7F5", from: 0.94, to: 1 },
] as const

const wedgePath = (center: number, from: number, to: number) => {
  const point = (fraction: number) => {
    const angle = fraction * 2 * Math.PI
    return `${center + center * Math.cos(angle)} ${center + center * Math.sin(angle)}`
  }
  const largeArc = to - from > 0.5 ? 1 : 0

  return `M ${center} ${center} L ${point(from)} A ${center} ${center} 0 ${largeArc} 1 ${point(
    to
  )} Z`
}

/**
 * A rotating blue "comet" traced around a pill's border, to mark it as featured (currently
 * only the City Guide navigation pill, when `isFeatured` is true).
 *
 * Must be rendered *before* the pill, inside the same box: it extends `RING_WIDTH` past that box
 * on every side and the pill's opaque background hides everything but that outer ring.
 *
 * Only `transform` and `opacity` are animated. Animating SVG props (e.g. `strokeDashoffset`) on Fabric forces a
 * shadow tree commit on every frame, which starves React's own commits and freezes the app.
 */
export const FeaturedPillGlow: React.FC = () => {
  const color = useColor()
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)
  const progress = useSharedValue(0)
  const opacity = useSharedValue(1)

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setSize({ width, height })
  }

  useEffect(() => {
    progress.set(0)
    progress.set(withTiming(1, { duration: TRACE_DURATION, easing: Easing.linear }))
    opacity.set(1)
    opacity.set(withDelay(TRACE_DURATION, withTiming(0, { duration: FADE_DURATION })))

    return () => {
      cancelAnimation(progress)
      cancelAnimation(opacity)
    }
  }, [progress, opacity])

  const width = size?.width ?? 0
  const height = size?.height ?? 0

  // Points the comet's sharp edge at a spot moving at constant speed along the pill's outline,
  // so it doesn't race around the rounded ends and crawl along the straight edges.
  const rotatingStyle = useAnimatedStyle(() => {
    const radius = height / 2
    const straight = Math.max(width - height, 0)
    const arc = Math.PI * radius
    const distance = progress.get() * 2 * (straight + arc)

    let x: number
    let y: number
    if (distance < straight) {
      x = distance - straight / 2
      y = -radius
    } else if (distance < straight + arc) {
      const angle = -Math.PI / 2 + (distance - straight) / radius
      x = straight / 2 + radius * Math.cos(angle)
      y = radius * Math.sin(angle)
    } else if (distance < 2 * straight + arc) {
      x = straight / 2 - (distance - straight - arc)
      y = radius
    } else {
      const angle = Math.PI / 2 + (distance - 2 * straight - arc) / radius
      x = -straight / 2 + radius * Math.cos(angle)
      y = radius * Math.sin(angle)
    }

    return { opacity: opacity.get(), transform: [{ rotate: `${Math.atan2(y, x)}rad` }] }
  })

  // The rotating square has to cover the whole pill at any angle, hence its diagonal.
  const diameter = Math.ceil(Math.hypot(width, height))
  const center = diameter / 2

  return (
    <View
      pointerEvents="none"
      onLayout={onLayout}
      style={[styles.container, { borderRadius: height / 2 }]}
    >
      {!!size && (
        <>
          <Animated.View
            style={[
              {
                position: "absolute",
                width: diameter,
                height: diameter,
                left: (width - diameter) / 2,
                top: (height - diameter) / 2,
              },
              rotatingStyle,
            ]}
          >
            <Svg width={diameter} height={diameter}>
              {BANDS.map((band) => (
                <Path
                  key={band.color}
                  d={wedgePath(center, band.from, band.to)}
                  fill={band.color}
                />
              ))}
            </Svg>
          </Animated.View>

          {/* Keeps the comet from showing through while the pill fades on press. */}
          <View
            style={[
              styles.cover,
              { borderRadius: height / 2 - RING_WIDTH, backgroundColor: color("mono0") },
            ]}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -RING_WIDTH,
    left: -RING_WIDTH,
    right: -RING_WIDTH,
    bottom: -RING_WIDTH,
    overflow: "hidden",
  },
  cover: {
    position: "absolute",
    top: RING_WIDTH,
    left: RING_WIDTH,
    right: RING_WIDTH,
    bottom: RING_WIDTH,
  },
})
