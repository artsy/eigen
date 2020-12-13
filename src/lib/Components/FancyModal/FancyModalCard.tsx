import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { RefObject, useImperativeHandle, useRef } from "react"
import { View } from "react-native"
import { PanGestureHandler, State, TapGestureHandler } from "react-native-gesture-handler"
import Animated, { Easing, SpringUtils } from "react-native-reanimated"

// The width of the black gutters either side of the first-from-the-front card
const CARD_GUTTER_WIDTH = 20

// The height of the area on screen where the cards can be seen stacking over each other.
// Stretches from the top of the front card to just above the top of the rearmost card.
export const CARD_STACK_OVERLAY_HEIGHT = 20
// The Y offset of the above described area. This sets it as starting -10px from the top safe area inset.
export const CARD_STACK_OVERLAY_Y_OFFSET = -10

const BORDER_RADIUS = 10

export interface FancyModalCard {
  readonly height: number
  backgroundShouldShrink: boolean
  recession: Animated.Value<number>
  appear(): Promise<void>
  disappear(): Promise<void>
}

/**
 * A FancyModalCard is a component which handles displaying the contents of a single layer of fancy modal content.
 *
 * It has a tappable backdrop and a content overlay and it is responsible for positioning the overlay and controlling
 * the opacity of the backdrop in response to directions from FancyModalContext, which manages a 'stack' of these cards.
 */
export const FancyModalCard = React.forwardRef<
  FancyModalCard,
  React.PropsWithChildren<{
    level: number
    height: number
    backgroundShouldShrink: boolean
    stack: Array<RefObject<FancyModalCard>>
    onBackgroundPressed(): void
  }>
>((props, ref) => {
  const screen = useScreenDimensions()
  const isRootCard = props.level === 0

  const recession = useRef(new Animated.Value(0)).current
  const pushEntrance = useRef(new Animated.Value(isRootCard ? 1 : 0)).current
  const _dragY = useRef(new Animated.Value(0 as number)).current
  const dragY = useRef(Animated.max(0, _dragY)).current
  // dragExit = (cardHeight - dragY) / cardHeight --- (so the more you drag it tends from 1 towards 0)
  const dragExit = useRef(Animated.divide(Animated.sub(props.height, dragY), props.height)).current
  const entrance = useRef(Animated.multiply(pushEntrance, dragExit)).current

  const dragState = useRef(new Animated.Value<number>(State.UNDETERMINED)).current
  const dragVelocityY = useRef(new Animated.Value<number>(0)).current

  const dragEvent = useRef(
    Animated.event([{ nativeEvent: { state: dragState, velocityY: dragVelocityY, translationY: _dragY } }])
  ).current

  const clock = useRef(new Animated.Clock()).current
  const triggeredClose = useRef(new Animated.Value<number>(0)).current

  Animated.useCode(
    () =>
      Animated.cond(Animated.eq(dragState, State.ACTIVE), Animated.stopClock(clock), [
        Animated.set(triggeredClose, Animated.greaterThan(dragVelocityY, 1000)),
        runSpring(
          clock,
          _dragY,
          dragVelocityY,
          Animated.cond(triggeredClose, props.height, 0),
          Animated.cond(
            triggeredClose,
            Animated.call([], () => {
              props.onBackgroundPressed()
            })
          )
        ),
      ]),
    []
  )

  const parentCard = props.stack[props.level - 1]?.current
  if (parentCard) {
    // safe to use a hook here, this should never change for a different instance
    Animated.useCode(() => Animated.set(parentCard.recession, props.backgroundShouldShrink ? entrance : recession), [])
  }

  const scale = useRef(
    Animated.interpolate(recession, {
      inputRange: [0, 1],
      outputRange: [1, (screen.width - 2 * CARD_GUTTER_WIDTH) / screen.width],
    })
  ).current

  const borderRadius = useRef(
    Animated.divide(
      Animated.interpolate(recession, {
        inputRange: [0, 0.5, 1],
        outputRange: [0, BORDER_RADIUS, BORDER_RADIUS],
      }),
      scale
    )
  ).current

  const bottom = useRef(
    Animated.interpolate(entrance, {
      inputRange: [0, 1],
      outputRange: [-props.height, 0],
    })
  ).current

  const recessedTop = screen.safeAreaInsets.top
  const naturalTop = isRootCard ? 0 : screen.height - props.height
  // scaleTopOffset = - (cardHeight - (cardHeight * scale)) / 2
  const scaleTopOffset = useRef(
    Animated.multiply(-1, Animated.divide(Animated.sub(props.height, Animated.multiply(props.height, scale)), 2))
  ).current

  const top = useRef(
    Animated.interpolate(recession, {
      inputRange: [0, 1],
      outputRange: [0, Animated.add(scaleTopOffset, recessedTop - naturalTop)],
    })
  ).current

  const translateY = useRef(Animated.add(Animated.multiply(-1, bottom), top)).current

  useImperativeHandle(
    ref,
    () => ({
      height: props.height,
      backgroundShouldShrink: props.backgroundShouldShrink,
      recession,
      async appear() {
        await new Promise((r) => spring(pushEntrance, 1).start(r))
      },
      async disappear() {
        await new Promise((r) => ease(pushEntrance, 0).start(r))
      },
    }),
    [props.height]
  )

  return (
    <View style={{ flex: 1 }}>
      {/* This view both darkens the backdrop and provides a touch target for dismissing the modal */}
      {!isRootCard && (
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: Animated.interpolate(entrance, {
              inputRange: [0, 1],
              outputRange: [0, 0.2],
            }),
            backgroundColor: "black",
          }}
        >
          <PanGestureHandler onHandlerStateChange={dragEvent} onGestureEvent={dragEvent} hitSlop={80}>
            <Animated.View style={{ flex: 1 }}>
              <TapGestureHandler
                onHandlerStateChange={(e) => {
                  if (e.nativeEvent.oldState === State.ACTIVE) {
                    props.onBackgroundPressed()
                  }
                }}
              >
                <Animated.View style={{ flex: 1 }}></Animated.View>
              </TapGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      )}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: isRootCard ? 0 : screen.height - props.height,
          bottom: 0,
          borderTopLeftRadius: isRootCard ? borderRadius : BORDER_RADIUS,
          borderTopRightRadius: isRootCard ? borderRadius : BORDER_RADIUS,
          overflow: "hidden",
          transform: [{ translateY }, { scale }],
        }}
      >
        {/* We need to apply background color in this extra inner view otherwise there is some glitchy
            tearing sometimes when hiding the modal */}
        <View style={{ flex: 1, backgroundColor: "white" }}>{props.children}</View>
      </Animated.View>

      {/* drag handle */}
      {props.level > 0 && (
        <Animated.View
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: screen.height - props.height,
            height: 60,
            borderWidth: 1,
            transform: [{ translateY }],
          }}
        >
          <PanGestureHandler onHandlerStateChange={dragEvent} onGestureEvent={dragEvent} hitSlop={80}>
            <Animated.View style={{ flex: 1 }}></Animated.View>
          </PanGestureHandler>
        </Animated.View>
      )}
    </View>
  )
})

function spring(node: Animated.Value<number>, toValue: number) {
  return Animated.spring(node, {
    ...SpringUtils.makeConfigFromBouncinessAndSpeed({
      ...SpringUtils.makeDefaultConfig(),
      bounciness: -7,
      speed: 14,
    }),
    toValue,
  })
}

export function ease(node: Animated.Value<number>, toValue: number) {
  return Animated.timing(node, { toValue, duration: 240, easing: Easing.ease })
}

// copied from https://github.com/software-mansion/react-native-reanimated/blob/master/Example/reanimated1/snappable/index.js
function runSpring(
  clock: Animated.Clock,
  value: Animated.Value<number>,
  velocity: Animated.Value<number>,
  dest: number | Animated.Node<number>,
  onFinish: Animated.Node<any>
) {
  // tslint:disable-next-line:no-shadowed-variable
  const { Value, cond, set, clockRunning, stopClock, startClock, spring, and } = Animated
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config = {
    damping: 70,
    mass: 0.5,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 500,
    restDisplacementThreshold: 10,
    toValue: new Value(0),
  }

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    set(value, state.position),
    cond(and(state.finished, clockRunning(clock)), [stopClock(clock), onFinish]),
  ]
}
