import { Image, useColor } from "@artsy/palette-mobile"
import { BOTTOM_TABS_HEIGHT } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { useEffect } from "react"
import { Modal, PixelRatio, StyleSheet, useWindowDimensions, View } from "react-native"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const CARD_W = 56
const CARD_H = 75

// top → bottom: blue, yellow, red, green, orange
const COLORS = ["#0000FF", "#FFFF00", "#FF0000", "#00FF00", "#FF8C00"] as const

// Natural pile rotation angles — makes the stack look like a casually placed pile
const PILE_ANGLES: ReadonlyArray<number> = [0, 5, -7, 8, -4]

// Stack depth offsets — card 0 on top at origin; 1–4 cascade behind/below
const STACK: ReadonlyArray<{ x: number; y: number }> = [
  { x: 0, y: 0 },
  { x: 2.5, y: 3 },
  { x: 5, y: 6 },
  { x: 7.5, y: 9 },
  { x: 10, y: 12 },
]

// Fan spread — card 0 fans right, card 4 fans left
const FAN_R = 160
const FAN_ANGLES: ReadonlyArray<number> = [20, 10, 0, -10, -20]
const toRad = (deg: number) => (deg * Math.PI) / 180
const FAN_X = FAN_ANGLES.map((deg) => FAN_R * Math.sin(toRad(deg)))
const FAN_Y = FAN_ANGLES.map((deg) => FAN_R * (1 - Math.cos(toRad(deg))))

// Drift stagger — card 4 (leftmost) first, card 0 (rightmost/top) last
const DRIFT_ORDER: ReadonlyArray<number> = [4, 3, 2, 1, 0]

const fontScale = PixelRatio.getFontScale()
const ICON_W = 53 * fontScale
const ICON_H = 49 * fontScale
const FAV_CARD_W = Math.round(23 * fontScale)
const FAV_CARD_H = Math.round(FAV_CARD_W * (4 / 3))

// Phase durations (ms)
const T_APPEAR = 350
const T_SPREAD = 700
const T_HOLD = 700
const T_STAGGER = 120
const T_DRIFT = 450
const T_SWAP = 150 // how fast all cards cut out / favCard cuts in when card 0 arrives
const T_FAV_HOLD = 2000
const T_FAV_VANISH = 400

const D_SPREAD = T_APPEAR
const D_DRIFT = D_SPREAD + T_SPREAD + T_HOLD
// D_FAV = moment card 0 (last) arrives at the Favorites tab
const D_FAV = D_DRIFT + 4 * T_STAGGER + T_DRIFT

const easeOut = Easing.out(Easing.cubic)
const easeInOut = Easing.inOut(Easing.cubic)

const PRE_DELAY_MS = 600

export const InfiniteDiscoveryCompletionAnimation: React.FC<{
  artworkImageUrls?: Array<{ url: string; blurhash?: string | null }>
  onComplete?: () => void
}> = ({ artworkImageUrls, onComplete }) => {
  const { width: W, height: H } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const color = useColor()

  const favX = W * 0.7 - W / 2
  const favY = H / 2 - insets.bottom - BOTTOM_TABS_HEIGHT / 2
  const targetScale = FAV_CARD_W / CARD_W

  // --- Shared values (no hooks in loops) ---

  const x0 = useSharedValue(STACK[0].x)
  const x1 = useSharedValue(STACK[1].x)
  const x2 = useSharedValue(STACK[2].x)
  const x3 = useSharedValue(STACK[3].x)
  const x4 = useSharedValue(STACK[4].x)

  const y0 = useSharedValue(STACK[0].y)
  const y1 = useSharedValue(STACK[1].y)
  const y2 = useSharedValue(STACK[2].y)
  const y3 = useSharedValue(STACK[3].y)
  const y4 = useSharedValue(STACK[4].y)

  // Rotation initialised to natural pile angles
  const r0 = useSharedValue(PILE_ANGLES[0])
  const r1 = useSharedValue(PILE_ANGLES[1])
  const r2 = useSharedValue(PILE_ANGLES[2])
  const r3 = useSharedValue(PILE_ANGLES[3])
  const r4 = useSharedValue(PILE_ANGLES[4])

  const sc0 = useSharedValue(1)
  const sc1 = useSharedValue(1)
  const sc2 = useSharedValue(1)
  const sc3 = useSharedValue(1)
  const sc4 = useSharedValue(1)

  // Single shared opacity for all cards — they appear together and disappear together
  // the instant card 0 (the "first"/top card) touches the Favorites icon.
  const opacity = useSharedValue(0)
  const favOpacity = useSharedValue(0)

  useEffect(() => {
    const done = () => onComplete?.()

    const xs = [x0, x1, x2, x3, x4]
    const ys = [y0, y1, y2, y3, y4]
    const rs = [r0, r1, r2, r3, r4]
    const scs = [sc0, sc1, sc2, sc3, sc4]

    const timer = setTimeout(() => {
      // All cards appear together, stay fully opaque through the entire animation,
      // then cut out the instant card 0 arrives at the Favorites tab (D_FAV).
      opacity.set(() =>
        withSequence(
          withTiming(1, { duration: T_APPEAR, easing: easeOut }),
          withTiming(1, { duration: D_FAV - T_APPEAR }),
          withTiming(0, { duration: T_SWAP })
        )
      )

      xs.forEach((x, i) => {
        const d = DRIFT_ORDER[i]
        x.set(() =>
          withDelay(
            D_SPREAD,
            withSequence(
              withTiming(FAN_X[i], { duration: T_SPREAD, easing: easeOut }),
              withTiming(FAN_X[i], { duration: T_HOLD + d * T_STAGGER }),
              withTiming(favX, { duration: T_DRIFT, easing: easeInOut })
            )
          )
        )
      })

      ys.forEach((y, i) => {
        const d = DRIFT_ORDER[i]
        y.set(() =>
          withDelay(
            D_SPREAD,
            withSequence(
              withTiming(FAN_Y[i], { duration: T_SPREAD, easing: easeOut }),
              withTiming(FAN_Y[i], { duration: T_HOLD + d * T_STAGGER }),
              withTiming(favY, { duration: T_DRIFT, easing: easeInOut })
            )
          )
        )
      })

      rs.forEach((r, i) => {
        const d = DRIFT_ORDER[i]
        r.set(() =>
          withDelay(
            D_SPREAD,
            withSequence(
              withTiming(FAN_ANGLES[i], { duration: T_SPREAD, easing: easeOut }),
              withTiming(FAN_ANGLES[i], { duration: T_HOLD + d * T_STAGGER }),
              withTiming(0, { duration: T_DRIFT, easing: easeInOut })
            )
          )
        )
      })

      scs.forEach((sc, i) => {
        const d = DRIFT_ORDER[i]
        sc.set(() =>
          withSequence(
            withTiming(1, { duration: T_APPEAR + T_SPREAD + T_HOLD + d * T_STAGGER }),
            withTiming(targetScale, { duration: T_DRIFT, easing: easeInOut })
          )
        )
      })

      // FavCard and mask appear simultaneously with the card cut-out
      favOpacity.set(() =>
        withDelay(
          D_FAV,
          withSequence(
            withTiming(1, { duration: T_SWAP }),
            withTiming(1, { duration: T_FAV_HOLD }),
            withTiming(0, { duration: T_FAV_VANISH }, () => {
              runOnJS(done)()
            })
          )
        )
      )
    }, PRE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [])

  // --- Animated styles ---
  const s0 = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: x0.get() },
      { translateY: y0.get() },
      { rotate: r0.get() + "deg" },
      { scale: sc0.get() },
    ],
  }))
  const s1 = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: x1.get() },
      { translateY: y1.get() },
      { rotate: r1.get() + "deg" },
      { scale: sc1.get() },
    ],
  }))
  const s2 = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: x2.get() },
      { translateY: y2.get() },
      { rotate: r2.get() + "deg" },
      { scale: sc2.get() },
    ],
  }))
  const s3 = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: x3.get() },
      { translateY: y3.get() },
      { rotate: r3.get() + "deg" },
      { scale: sc3.get() },
    ],
  }))
  const s4 = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: x4.get() },
      { translateY: y4.get() },
      { rotate: r4.get() + "deg" },
      { scale: sc4.get() },
    ],
  }))

  const favStyle = useAnimatedStyle(() => ({ opacity: favOpacity.get() }))

  const heartCenterX = W * 0.7 - ICON_W / 2 + 26 * fontScale
  const heartCenterY = H - BOTTOM_TABS_HEIGHT - insets.bottom + 4 + 27 * fontScale
  const favIconLeft = heartCenterX - FAV_CARD_W / 2
  const favIconTop = heartCenterY - FAV_CARD_H / 2
  const maskLeft = W * 0.7 - ICON_W / 2
  const maskTop = H - BOTTOM_TABS_HEIGHT - insets.bottom + 4

  return (
    <Modal transparent statusBarTranslucent animationType="none" visible>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {([4, 3, 2, 1, 0] as const).map((i, idx) => {
          const animStyle = [s4, s3, s2, s1, s0][idx]
          const imageUrl = artworkImageUrls?.[i]
          return (
            <Animated.View key={i} style={[styles.card, { backgroundColor: COLORS[i] }, animStyle]}>
              {!!imageUrl && (
                <Image
                  src={imageUrl.url}
                  blurhash={imageUrl.blurhash ?? undefined}
                  width={CARD_W}
                  height={CARD_H}
                  style={{ position: "absolute", top: 0, left: 0 }}
                />
              )}
            </Animated.View>
          )
        })}

        <Animated.View
          style={[
            {
              position: "absolute",
              left: maskLeft,
              top: maskTop,
              width: ICON_W,
              height: ICON_H,
              backgroundColor: color("background"),
            },
            favStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.favCard,
            { left: favIconLeft, top: favIconTop, width: FAV_CARD_W, height: FAV_CARD_H },
            favStyle,
          ]}
        >
          {!!artworkImageUrls?.[0] && (
            <Image
              src={artworkImageUrls[0].url}
              blurhash={artworkImageUrls[0].blurhash ?? undefined}
              width={FAV_CARD_W}
              height={FAV_CARD_H}
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: CARD_W,
    height: CARD_H,
    top: "50%",
    left: "50%",
    marginTop: -CARD_H / 2,
    marginLeft: -CARD_W / 2,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "white",
    overflow: "hidden",
  },
  favCard: {
    position: "absolute",
    borderRadius: 3,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "#0000FF", // fallback when no image
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
})
