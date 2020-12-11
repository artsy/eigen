import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { RefObject, useImperativeHandle, useRef } from "react"
import { View } from "react-native"
import { PanGestureHandler, State, TouchableWithoutFeedback } from "react-native-gesture-handler"
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
  const dragY = useRef(new Animated.Value(0 as number)).current
  // dragExit = (cardHeight - dragY) / cardHeight --- (so the more you drag it tends from 1 towards 0)
  const dragExit = useRef(Animated.divide(Animated.sub(props.height, dragY), props.height)).current
  const entrance = useRef(Animated.multiply(pushEntrance, dragExit)).current

  const dragState = useRef(new Animated.Value<number>(State.UNDETERMINED)).current
  const dragVelocityY = useRef(new Animated.Value<number>(0)).current

  const dragEvent = useRef(
    Animated.event([{ nativeEvent: { state: dragState, velocityY: dragVelocityY, translationY: dragY } }])
  ).current

  const clock = useRef(new Animated.Clock()).current

  Animated.useCode(
    () =>
      Animated.cond(
        Animated.eq(dragState, State.ACTIVE),
        Animated.stopClock(clock),
        runSpring(clock, dragY, dragVelocityY, 0)
      ),
    []
  )

  const parentCard = props.stack[props.level - 1]?.current
  if (parentCard) {
    // safe to use a hook here, this should never change for a different instance
    Animated.useCode(() => Animated.set(parentCard.recession, entrance), [])
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
        inputRange: [0, 1],
        outputRange: [0, BORDER_RADIUS],
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
    <View style={{ flex: 1, borderWidth: 1, borderColor: "red" }}>
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
          <TouchableWithoutFeedback
            onPress={props.onBackgroundPressed}
            style={{
              flex: 1,
            }}
          ></TouchableWithoutFeedback>
        </Animated.View>
      )}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: props.height,
          borderTopLeftRadius: isRootCard ? borderRadius : BORDER_RADIUS,
          borderTopRightRadius: isRootCard ? borderRadius : BORDER_RADIUS,
          overflow: "hidden",
          transform: [{ translateY }, { scale }],
        }}
      >
        {/* We need to apply background color in this extra inner view otherwise there is some glitchy
            tearing sometimes when hiding the modal */}
        <View style={{ flex: 1, backgroundColor: "white" }}>{props.children}</View>
        {/* drag handle */}
        {props.level > 0 && (
          <PanGestureHandler
            // onHandlerStateChange={(e) => {
            //   if (e.nativeEvent.oldState === State.ACTIVE) {
            //     Animated.spring(dragY, {
            //       velocity: e.nativeEvent.velocityY,
            //       toValue: 0,
            //     })
            //     spring(dragY, 0).start()
            //     if (e.nativeEvent.velocityY > 1000 || e.nativeEvent.translationY > 300) {
            //       console.warn({ velocityY: e.nativeEvent.velocityY, translationY: e.nativeEvent.translationY })
            //       props.onBackgroundPressed()
            //     }
            //   }
            // }}
            onHandlerStateChange={dragEvent}
            onGestureEvent={dragEvent}
          >
            <Animated.View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: -30,
                height: 50,
                borderWidth: 1,
                borderColor: "blue",
              }}
            ></Animated.View>
          </PanGestureHandler>
        )}
      </Animated.View>
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
  dest: number
) {
  // tslint:disable-next-line:no-shadowed-variable
  const { Value, cond, set, clockRunning, stopClock, startClock, spring } = Animated
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config = {
    damping: 70,
    mass: 1,
    stiffness: 101.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
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
    cond(state.finished, stopClock(clock)),
  ]
}

// export type AnimationCreator = typeof spring | typeof ease

// /**
//  * A FancyModalCard is a component which handles displaying the contents of a single layer of fancy modal content.
//  *
//  * It has a tappable backdrop and a content overlay and it is responsible for positioning the overlay and controlling
//  * the opacity of the backdrop in response to directions from FancyModalContext, which manages a 'stack' of these cards.
//  */
// export const FancyModalCard = React.forwardRef<
//   FancyModalCard,
//   React.PropsWithChildren<{
//     level: number
//     height: number
//     backgroundShouldShrink: boolean
//     onBackgroundPressed(): void
//   }>
// >((props, ref) => {
//   const screen = useScreenDimensions()
//   const isRootCard = props.level === 0
//   const backdropOpacity = useRef(new Animated.Value(0)).current
//   const scale = useRef(new Animated.Value(1)).current
//   const translateY = useRef(new Animated.Value(isRootCard ? 0 : props.height)).current
//   const borderRadius = useRef(new Animated.Value(isRootCard ? 0 : 10)).current

//   const dragY = useRef(new Animated.Value(0)).current

//   useImperativeHandle(
//     ref,
//     () => ({
//       height: props.height,
//       backgroundShouldShrink: props.backgroundShouldShrink,
//       getPopAnimations(createAnimation) {
//         return [
//           createAnimation(backdropOpacity, 0),
//           createAnimation(borderRadius, BORDER_RADIUS),
//           createAnimation(scale, 1),
//           createAnimation(translateY, props.height),
//         ]
//       },
//       getStackAnimations(createAnimation, stack) {
//         if (isRootCard && stack.length === 1) {
//           // There are no fancy modals showing, so reset the background.
//           return [
//             createAnimation(backdropOpacity, 0),
//             createAnimation(borderRadius, 0),
//             createAnimation(scale, 1),
//             createAnimation(translateY, 0),
//           ]
//         }

//         // we need to know how many perceived layers in the stack there are to decide how to position this card
//         let perceivedDistanceFromTopOfStack = 0
//         let perceivedStackHeight = 1
//         for (let i = 1; i < stack.length; i++) {
//           if (stack[i]?.current?.backgroundShouldShrink) {
//             perceivedStackHeight += 1
//             if (i > props.level) {
//               perceivedDistanceFromTopOfStack += 1
//             }
//           }
//         }

//         // The degree by which the cards should shrink at each layer.
//         const scaleFactor = (screen.width - 2 * CARD_GUTTER_WIDTH) / screen.width
//         // The scale of this particular card's content.
//         const levelScale = Math.pow(scaleFactor, perceivedDistanceFromTopOfStack)

//         // The max height of all the cards *above* this one.
//         // We need this because if this card is 302px high and it pushes a new modal with height 402px, we need to slide
//         // this card up another 100px
//         let maxHeight = 0
//         for (let i = stack.length - 1; i >= 0; i--) {
//           maxHeight = Math.max(stack[i].current?.height ?? 0, maxHeight)
//           if (i === props.level) {
//             break
//           }
//         }

//         // The highest this card could possibly go. This is placed inside the stack overlay area (described above).
//         const minTop =
//           screen.safeAreaInsets.top +
//           CARD_STACK_OVERLAY_HEIGHT +
//           CARD_STACK_OVERLAY_Y_OFFSET -
//           (CARD_STACK_OVERLAY_HEIGHT / perceivedStackHeight + 1) * perceivedDistanceFromTopOfStack
//         // The maximum distance between two cards' tops if they are stacked adjacently (and the front card does not have
//         // a smaller height than the one behind)
//         const maxStackOverlayOffset = CARD_STACK_OVERLAY_HEIGHT / 2
//         // The lowest this card could possibly go. This could be haflway down the screen if the heights are such.
//         const maxTop = isRootCard
//           ? minTop
//           : screen.height - maxHeight - maxStackOverlayOffset * perceivedDistanceFromTopOfStack
//         // Now we select the top position which is furthest down the screen as the optimal choice
//         const top = Math.max(minTop, maxTop)
//         // The top position of the card if it is at the front of the stack
//         const naturalTop = isRootCard ? 0 : screen.height - props.height
//         // The offset we need to apply to scale the card down without affecting it's top position (we cannot set the
//         // transform origin alas, so this is used as a workaround)
//         const scaleYOffset = (props.height - props.height * levelScale) / 2

//         let totalYoffset = -scaleYOffset - (naturalTop - top)

//         if (isRootCard && perceivedDistanceFromTopOfStack === 0) {
//           totalYoffset = 0
//         }

//         return [
//           createAnimation(backdropOpacity, 0.2),
//           createAnimation(borderRadius, BORDER_RADIUS),
//           createAnimation(scale, levelScale),
//           createAnimation(translateY, totalYoffset),
//         ]
//       },
//     }),
//     [props.height]
//   )

//   return (
//     <View style={{ flex: 1 }}>
//       {/* This view both darkens the backdrop and provides a touch target for dismissing the modal */}
//       {!isRootCard && (
//         <TouchableWithoutFeedback
//           style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }}
//           onPress={props.onBackgroundPressed}
//         >
//           <Animated.View
//             style={{
//               flex: 1,
//               backgroundColor: "black",
//               opacity: backdropOpacity,
//             }}
//           ></Animated.View>
//         </TouchableWithoutFeedback>
//       )}
//       <Animated.View
//         style={{
//           position: "absolute",
//           left: 0,
//           right: 0,
//           bottom: 0,
//           height: props.height,
//           borderTopLeftRadius: borderRadius,
//           borderTopRightRadius: borderRadius,
//           overflow: "hidden",
//           transform: [
//             {
//               translateY: Animated.add(translateY, dragY),
//             },
//             {
//               scale: 1,
//             },
//           ],
//         }}
//       >
//         {/* We need to apply background color in this extra inner view otherwise there is some glitchy
//             tearing sometimes when hiding the modal */}
//         <View style={{ flex: 1, backgroundColor: "white" }}>{props.children}</View>
//         {/* drag handle */}
//         {props.level > 0 && (
//           <PanGestureHandler
//             onHandlerStateChange={(e) => {
//               if (e.nativeEvent.oldState === State.ACTIVE) {
//                 spring(dragY, 0).start()
//                 if (e.nativeEvent.velocityY > 1000 || e.nativeEvent.translationY > 300) {
//                   console.warn({ velocityY: e.nativeEvent.velocityY, translationY: e.nativeEvent.translationY })
//                   props.onBackgroundPressed()
//                 }
//               }
//             }}
//             onGestureEvent={(e) => {
//               Animated.timing(dragY, {
//                 toValue: e.nativeEvent.translationY,
//                 duration: 10,
//                 useNativeDriver: true,
//               }).start()
//               return false
//             }}
//           >
//             <Reanimated.View
//               style={{
//                 position: "absolute",
//                 left: 0,
//                 right: 0,
//                 top: -30,
//                 height: 50,
//                 borderWidth: 1,
//                 borderColor: "blue",
//               }}
//             ></Reanimated.View>
//           </PanGestureHandler>
//         )}
//       </Animated.View>
//     </View>
//   )
// })
