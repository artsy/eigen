import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { RefObject, useImperativeHandle, useRef } from "react"
import { Animated, TouchableWithoutFeedback, View } from "react-native"

// The width of the black gutters either side of the first-from-the-front card
const CARD_GUTTER_WIDTH = 20

// The height of the area on screen where the cards can be seen stacking over each other.
// Stretches from the top of the front card to just above the top of the rearmost card
export const CARD_STACK_OVERLAY_HEIGHT = 20
// The Y offset of the above described area. This sets it as starting -10px from the top safe area inset
export const CARD_STACK_OVERLAY_Y_OFFSET = -10

const BORDER_RADIUS = 10

export interface FancyModalCard {
  readonly height: number
  getStackAnimations(
    createAnimation: AnimationCreator,
    stack: Array<RefObject<FancyModalCard>>
  ): Animated.CompositeAnimation[]
  getPopAnimations(createAnimation: AnimationCreator): Animated.CompositeAnimation[]
}

/**
 * A FancyModalCard is a component which handles displaying the contents of a single layer of fancy modal content.
 *
 * It has a tappable backdrop and a content overlay and it is responsible for positioning the overlay and controlling
 * the opacity of the backdrop in response to directions from FancyModalContext, which manages a 'stack' of these cards
 */
export const FancyModalCard = React.forwardRef<
  FancyModalCard,
  React.PropsWithChildren<{ level: number; height: number; onBackgroundPressed(): void }>
>((props, ref) => {
  const screen = useScreenDimensions()
  const isRootCard = props.level === 0
  const backdropOpacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(isRootCard ? 0 : props.height)).current
  const borderRadius = useRef(new Animated.Value(isRootCard ? 0 : 10)).current

  useImperativeHandle(
    ref,
    () => ({
      height: props.height,
      getPopAnimations(createAnimation) {
        return [
          createAnimation(backdropOpacity, 0),
          createAnimation(borderRadius, BORDER_RADIUS),
          createAnimation(scale, 1),
          createAnimation(translateY, props.height),
        ]
      },
      getStackAnimations(createAnimation, stack) {
        if (isRootCard && stack.length === 1) {
          // no fancy modals showing, so reset the background
          return [
            createAnimation(backdropOpacity, 0),
            createAnimation(borderRadius, 0),
            createAnimation(scale, 1),
            createAnimation(translateY, 0),
          ]
        }

        const distanceFromTopOfStack = Math.max(stack.length - props.level - 1, 0)

        // the degree by which the cards should shrink at each layer
        const scaleFactor = (screen.width - 2 * CARD_GUTTER_WIDTH) / screen.width
        // the scale of this particular card's content
        const levelScale = Math.pow(scaleFactor, distanceFromTopOfStack)

        // the max height of all the cards *above* this one
        // we need this because if this card is 302px high and it pushes a new modal with height 402px, we need to slide
        // this card up another 100px
        let maxHeight = 0
        for (let i = stack.length - 1; i >= 0; i--) {
          maxHeight = Math.max(stack[i].current?.height ?? 0, maxHeight)
          if (i === props.level) {
            break
          }
        }
        // the highest this card could possibly go. This is placed inside the stack overlay area (described above)
        const minTop =
          screen.safeAreaInsets.top +
          CARD_STACK_OVERLAY_HEIGHT +
          CARD_STACK_OVERLAY_Y_OFFSET -
          (CARD_STACK_OVERLAY_HEIGHT / stack.length + 1) * distanceFromTopOfStack
        // the maximum distance between two card's tops if they are stacked adjacently (and the one on top does not have
        // a smaller height than the one below)
        const maxStackOverlayOffset = CARD_STACK_OVERLAY_HEIGHT / 2
        // the lowest this card could possibly go. This could be haflway down the screen if the heights are such
        const maxTop = isRootCard ? minTop : screen.height - maxHeight - maxStackOverlayOffset * distanceFromTopOfStack
        // now we select the top position which is furthest down the screen as the optimal choice
        const top = Math.max(minTop, maxTop)
        // the top position of the card if it is on the top of the stack
        const naturalTop = isRootCard ? 0 : screen.height - props.height
        // the offset we need to apply to scale the card down without affecting it's top position (we cannot set the
        // transform origin alas, so this is used as a workaround)
        const scaleYOffset = (props.height - props.height * levelScale) / 2

        const totalYoffset = -scaleYOffset - (naturalTop - top)

        return [
          createAnimation(backdropOpacity, 0.2),
          createAnimation(borderRadius, BORDER_RADIUS),
          createAnimation(scale, levelScale),
          createAnimation(translateY, totalYoffset),
        ]
      },
    }),
    [props.height]
  )

  return (
    <View style={{ flex: 1 }}>
      {/* this view both darkens the backdrop and provides a touch target for dismissing the modal */}
      {!isRootCard && (
        <TouchableWithoutFeedback
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0 }}
          onPress={props.onBackgroundPressed}
        >
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: "black",
              opacity: backdropOpacity,
            }}
          ></Animated.View>
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: props.height,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          overflow: "hidden",
          transform: [
            {
              translateY,
            },
            {
              scale,
            },
          ],
        }}
      >
        {/* need to apply background color in this extra inner view otherwise there is some glitchy
            tearing sometimes when hiding the modal */}
        <View style={{ flex: 1, backgroundColor: "white" }}>{props.children}</View>
      </Animated.View>
    </View>
  )
})

export function spring(node: Animated.Value, toValue: number) {
  return Animated.spring(node, { toValue, useNativeDriver: true, bounciness: -7, speed: 13 })
}

export function ease(node: Animated.Value, toValue: number) {
  return Animated.timing(node, { toValue, useNativeDriver: true, duration: 340 })
}

export type AnimationCreator = typeof spring | typeof ease
