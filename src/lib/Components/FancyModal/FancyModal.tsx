import { useExecutionQueue } from "lib/utils/useExecutionQueue"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { RefObject, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Animated, Dimensions, KeyboardAvoidingView, Modal, TouchableWithoutFeedback, View } from "react-native"

const CARD_GUTTER_WIDTH = 20
const CARD_STACK_OVERLAY_HEIGHT = 20
const CARD_STACK_OVERLAY_Y_OFFSET = -10
const scaleFactor = (Dimensions.get("screen").width - 2 * CARD_GUTTER_WIDTH) / Dimensions.get("screen").width
const BORDER_RADIUS = 10

interface FancyModalCard {
  readonly height: number
  readonly backdropOpacity: Animated.Value
  readonly scale: Animated.Value
  readonly translateY: Animated.Value
  readonly borderRadius: Animated.Value
}

const FancyModalCard = React.forwardRef<
  FancyModalCard,
  React.PropsWithChildren<{ height: number; onBackgroundPressed(): void }>
>((props, ref) => {
  const context = useContext(FancyModalContext)
  const backdropOpacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(context.level === 0 ? 0 : props.height)).current
  const borderRadius = useRef(new Animated.Value(context.level === 0 ? 0 : 10)).current

  const imperativeHandle: FancyModalCard = useRef({
    height: props.height,
    backdropOpacity,
    scale,
    translateY,
    borderRadius,
  }).current

  useImperativeHandle(ref, () => imperativeHandle, [])
  useEffect(() => {
    // @ts-ignore
    imperativeHandle.height = props.height
  }, [props.height])

  return (
    <View style={{ flex: 1 }}>
      {/* this view both darkens the backdrop and provides a touch target for dismissing the modal */}
      {context.level > 0 && (
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

const FancyModalContext = React.createContext<{
  level: number
  useCard(config: {
    content: React.ReactNode
    height: number
    onBackgroundPressed(): void
  }): {
    jsx: JSX.Element
    show(): Promise<void>
    hide(): Promise<void>
  }
}>(
  __TEST__
    ? {
        level: 0,
        useCard(config) {
          return {
            jsx: config.content,
            show() {
              return
            },
            hide: async () => {
              return
            },
          }
        },
      }
    : (null as any)
)

export const _FancyModalPageWrapper: React.FC = ({ children }) => {
  const screen = useScreenDimensions()
  const [height, setHeight] = useState(Dimensions.get("screen").height)

  const stack: Array<RefObject<FancyModalCard>> = useRef([{ current: null }]).current

  const needsCleanup = useRef(false)

  const { executeInQueue } = useExecutionQueue()

  const cleanup = () => {
    requestAnimationFrame(() => {
      executeInQueue(async () => {
        if (needsCleanup.current) {
          needsCleanup.current = false
          await runAnimations(createStackAnimations(stack, timing, screen))
        }
      })
    })
  }

  return (
    <FancyModalContext.Provider
      value={{
        level: 0,
        useCard(config: { content: JSX.Element; height: number; onBackgroundPressed(): void }) {
          const ref = useRef<FancyModalCard>(null)
          const jsx = (
            <FancyModalCard ref={ref} onBackgroundPressed={config.onBackgroundPressed} height={config.height}>
              {config.content}
            </FancyModalCard>
          )
          useEffect(() => {
            return () => {
              if (stack.includes(ref)) {
                stack.splice(stack.indexOf(ref), 1)
              }
              needsCleanup.current = true
              cleanup()
            }
          }, [])
          return {
            jsx,
            async show() {
              await executeInQueue(async () => {
                stack.push(ref)
                await runAnimations(createStackAnimations(stack, spring, screen))
              })
            },
            async hide() {
              await executeInQueue(async () => {
                if (stack.includes(ref)) {
                  stack.splice(stack.indexOf(ref), 1)
                  await runAnimations([
                    ...createStackAnimations(stack, timing, screen),
                    ...(ref.current ? createPopAnimations(ref.current, timing) : []),
                  ])
                }
              })
            },
          }
        },
      }}
    >
      <View style={{ flex: 1, backgroundColor: "black" }} onLayout={e => setHeight(e.nativeEvent.layout.height)}>
        <FancyModalCard height={height} onBackgroundPressed={() => null} ref={stack[0]}>
          {children}
        </FancyModalCard>
      </View>
    </FancyModalContext.Provider>
  )
}

async function runAnimations(animations: Animated.CompositeAnimation[]) {
  await new Promise(resolve => Animated.parallel(animations).start(resolve))
}

function spring(node: Animated.Value, toValue: number) {
  return Animated.spring(node, { toValue, useNativeDriver: true, bounciness: -7, speed: 13 })
}

function timing(node: Animated.Value, toValue: number) {
  return Animated.timing(node, { toValue, useNativeDriver: true, duration: 340 })
}

type AnimationCreator = typeof spring | typeof timing

function createStackAnimations(
  stack: Array<RefObject<FancyModalCard>>,
  createAnimation: AnimationCreator,
  screen: ReturnType<typeof useScreenDimensions>
): Animated.CompositeAnimation[] {
  if (stack.length === 1) {
    // reset the background to normalcy
    const card = stack[0].current
    if (!card) {
      return []
    }
    return [
      createAnimation(card.backdropOpacity, 0),
      createAnimation(card.borderRadius, 0),
      createAnimation(card.scale, 1),
      createAnimation(card.translateY, 0),
    ]
  }

  const animations: Animated.CompositeAnimation[] = []

  for (let level = 0; level < stack.length; level++) {
    const card = stack[level].current
    if (!card) {
      continue
    }

    const distanceFromTopOfStack = Math.max(stack.length - level - 1, 0)
    const scale = Math.pow(scaleFactor, distanceFromTopOfStack)
    const backdropOpacity = 0.2
    let maxHeight = 0
    for (let i = stack.length - 1; i >= 0; i--) {
      maxHeight = Math.max(stack[i].current?.height ?? 0, maxHeight)
      if (i === level) {
        break
      }
    }
    const minTop =
      screen.safeAreaInsets.top +
      CARD_STACK_OVERLAY_HEIGHT +
      CARD_STACK_OVERLAY_Y_OFFSET -
      (CARD_STACK_OVERLAY_HEIGHT / stack.length + 1) * distanceFromTopOfStack
    const maxTop = level === 0 ? minTop : screen.height - maxHeight - 10 * distanceFromTopOfStack
    const top = Math.max(minTop, maxTop)
    const naturalTop = level === 0 ? 0 : screen.height - card.height
    const scaleYOffset = (card.height - card.height * scale) / 2
    const translateY = -scaleYOffset - (naturalTop - top)
    animations.push(
      createAnimation(card.backdropOpacity, backdropOpacity),
      createAnimation(card.borderRadius, BORDER_RADIUS),
      createAnimation(card.scale, scale),
      createAnimation(card.translateY, translateY)
    )
  }
  return animations
}

function createPopAnimations(card: FancyModalCard, createAnimation: AnimationCreator) {
  return [
    createAnimation(card.backdropOpacity, 0),
    createAnimation(card.borderRadius, BORDER_RADIUS),
    createAnimation(card.scale, 1),
    createAnimation(card.translateY, card.height),
  ]
}

export const FancyModal: React.FC<{ visible: boolean; maxHeight?: number; onBackgroundPressed(): void }> = ({
  visible,
  children,
  onBackgroundPressed,
  maxHeight,
}) => {
  const {
    height: screenHeight,
    safeAreaInsets: { top },
  } = useScreenDimensions()

  const actualMaxHeight = screenHeight - (top + CARD_STACK_OVERLAY_HEIGHT + CARD_STACK_OVERLAY_Y_OFFSET)
  const height = maxHeight ? Math.min(maxHeight, actualMaxHeight) : actualMaxHeight

  const firstMount = useRef(true)

  const [showingUnderlyingModal, setShowingUnderlyingModal] = useState(visible)

  const context = useContext(FancyModalContext)
  const card = context.useCard({
    height,
    content: showingUnderlyingModal ? (
      /* Keyboard Avoiding
        This works fine for full-screen fancy modals but a couple of caveats for the future:
        - We might want to allow consumers to turn this off
        - Consumers might have bottom-padding on their modal content that they
          don't want to be pushed up, so we could allow them to subtract that
          from the keyboardVerticalOffset
        - non-full-screen modals with text inputs will require us implementing
          a custom keyboardAvoidingView which is able to combine the 'padding' and
          'position' strategies. When the keyboard opens we'd first want to bring the modal
          up to the maximum 'top' value, and then add padding if the keyboard comes up any more.
          I'd imagine it would have an API like <FancyKeyboardAvoding height={sheetHeighht} maxHeight={screenHeight - (top + 10)}>
      */
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} keyboardVerticalOffset={screenHeight - height}>
        {children}
      </KeyboardAvoidingView>
    ) : null,
    onBackgroundPressed,
  })

  useEffect(() => {
    if (visible) {
      setShowingUnderlyingModal(true)
      requestAnimationFrame(card.show)
    } else {
      if (!firstMount.current) {
        card.hide().then(() => {
          setShowingUnderlyingModal(false)
        })
      }
    }
    firstMount.current = false
  }, [visible])

  return (
    <Modal transparent animated={false} visible={showingUnderlyingModal}>
      <FancyModalContext.Provider value={{ ...context, level: context.level + 1 }}>
        {card.jsx}
      </FancyModalContext.Provider>
    </Modal>
  )
}
