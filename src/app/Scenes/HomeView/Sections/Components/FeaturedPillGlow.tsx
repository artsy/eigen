import React, { useEffect, useState } from "react"
import { LayoutChangeEvent, StyleSheet, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { Rect, Svg } from "react-native-svg"

const AnimatedRect = Animated.createAnimatedComponent(Rect)

const TRACE_DURATION = 4500

/**
 * Each animated ring's color and dash/gap split, as a fraction (0-1) of the pill's own
 * perimeter — computed from the pill's measured size, since `react-native-svg` only honors
 * `pathLength`'s percentage-based dash math on web, not on iOS/Android. Lightest and tightest
 * dash first, darkest and widest gap last — all nine share one clockwise sweep, so layering
 * them reads as a blue comet trailing around the pill rather than nine separate rings.
 */
const RINGS = [
  { color: "#CED1F2", dash: 0.94, gap: 0.06 },
  { color: "#B7BCEE", dash: 0.905, gap: 0.095 },
  { color: "#9FA6EB", dash: 0.87, gap: 0.13 },
  { color: "#8891E8", dash: 0.835, gap: 0.165 },
  { color: "#707BE5", dash: 0.8, gap: 0.2 },
  { color: "#5966E1", dash: 0.765, gap: 0.235 },
  { color: "#4150DE", dash: 0.73, gap: 0.27 },
  { color: "#2A3BDB", dash: 0.695, gap: 0.305 },
  { color: "#1023D7", dash: 0.65, gap: 0.35 },
] as const

/** Always-visible resting outline the comet sweeps over. */
const BASE_RING_COLOR = "#E6E7F5"

/**
 * A rotating blue "comet" traced around a pill's border, to mark it as featured (currently
 * only the City Guide navigation pill, when `isFeatured` is true).
 *
 * Absolutely positioned over the pill by the caller; renders nothing of its own but the traced
 * border, so it composes with whatever the pill already renders instead of replacing it. Needs
 * `onLayout` from the same box the pill fills, since the dash lengths are fractions of the
 * pill's own (rounded-rect) perimeter, not fixed pixels — a wider pill (a longer title) gets a
 * proportionally longer dash, so the comet always looks the same relative size.
 */
export const FeaturedPillGlow: React.FC = () => {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)
  const offset = useSharedValue(0)

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setSize({ width, height })
  }

  // A fully-rounded pill: corner radius is half the (shorter) height. Perimeter of a
  // rounded rect = the two straight edge pairs, shortened by the corners, plus the four
  // corners' arcs, which together make exactly one full circle of that radius.
  const perimeter = size
    ? 2 * (size.width + size.height - 2 * (size.height / 2)) + 2 * Math.PI * (size.height / 2)
    : 0

  useEffect(() => {
    if (!perimeter) return

    offset.set(perimeter)
    offset.set(
      withRepeat(withTiming(0, { duration: TRACE_DURATION, easing: Easing.linear }), -1, false)
    )
  }, [offset, perimeter])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: offset.get(),
  }))

  return (
    // `onLayout` lives on this plain `View`, not the `Svg` below: `react-native-svg`'s native
    // renderer needs concrete numeric `width`/`height` to paint anything at all, so it can't be
    // the thing that measures its own size — a `View` sized by `StyleSheet.absoluteFill` from
    // its parent (the pill) can.
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={onLayout}>
      {!!size && (
        <Svg width={size.width} height={size.height}>
          <Rect
            x={0.75}
            y={0.75}
            width={size.width - 1.5}
            height={size.height - 1.5}
            rx={size.height / 2}
            fill="none"
            stroke={BASE_RING_COLOR}
            strokeWidth={1}
          />
          {RINGS.map((ring) => (
            <AnimatedRect
              key={ring.color}
              x={0.75}
              y={0.75}
              width={size.width - 1.5}
              height={size.height - 1.5}
              rx={size.height / 2}
              fill="none"
              stroke={ring.color}
              strokeWidth={1}
              strokeDasharray={[perimeter * ring.dash, perimeter * ring.gap]}
              animatedProps={animatedProps}
            />
          ))}
        </Svg>
      )}
    </View>
  )
}
