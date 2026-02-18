import { delay } from "app/utils/delay"
import { useCallback, useState, useEffect, useRef, createContext } from "react"
import { Animated } from "react-native"
import { PopoverMessage, PopoverMessageItem } from "./PopoverMessage"

interface PopoverMessageContextContextValue {
  show: (options: PopoverMessageItem) => void
  hide: () => void
}

const SHOW_ANIMATION_VELOCITY = 450
const HIDE_ANIMATION_VELOCITY = 400
const REPLACE_ANIMATION_VELOCITY = 350

export const PopoverMessageContext = createContext<PopoverMessageContextContextValue>({
  show: () => {},

  hide: () => {},
})

export const PopoverMessageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [popoverMessage, setPopoverMessage] = useState<PopoverMessageItem | null>(null)
  const showingPopoverMessage = useRef<boolean>(false)
  const lastStartedAt = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [opacityAnim] = useState(new Animated.Value(0))
  const [translateYAnim] = useState(new Animated.Value(0))

  const runAnimation = useCallback((mode: "show" | "hide") => {
    const nextAnimationValue = mode === "show" ? 1 : 0
    const animationDuration = mode === "show" ? SHOW_ANIMATION_VELOCITY : HIDE_ANIMATION_VELOCITY

    return new Promise((resolve) => {
      if (__TEST__) {
        return resolve(null)
      }

      Animated.parallel([
        Animated.spring(translateYAnim, {
          toValue: nextAnimationValue,
          useNativeDriver: true,
          friction: 55,
        }),
        Animated.timing(opacityAnim, {
          toValue: nextAnimationValue,
          useNativeDriver: true,
          duration: animationDuration,
        }),
      ]).start(resolve)
    })
  }, [])

  const clearStartedTimeout = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const hide: PopoverMessageContextContextValue["hide"] = useCallback(async () => {
    await runAnimation("hide")
    setPopoverMessage(null)
    clearStartedTimeout()
    showingPopoverMessage.current = false
  }, [setPopoverMessage])

  const show: PopoverMessageContextContextValue["show"] = useCallback(
    async (options) => {
      const { autoHide = true, hideTimeout = 3500 } = options
      const now = Date.now()
      lastStartedAt.current = now

      clearStartedTimeout()

      if (showingPopoverMessage.current) {
        runAnimation("hide")
        await delay(REPLACE_ANIMATION_VELOCITY)
      }

      // Check race condition
      if (lastStartedAt.current === now) {
        setPopoverMessage(options)
        showingPopoverMessage.current = true

        if (autoHide) {
          timer.current = setTimeout(hide, hideTimeout)
        }

        lastStartedAt.current = null
      }
    },
    [clearStartedTimeout, hide, setPopoverMessage]
  )

  useEffect(() => {
    if (popoverMessage) {
      runAnimation("show")
    }
  }, [popoverMessage])

  return (
    <PopoverMessageContext.Provider value={{ show, hide }}>
      {children}
      {!!popoverMessage && (
        <PopoverMessage
          {...popoverMessage}
          opacityAnimation={opacityAnim}
          translateYAnimation={translateYAnim}
        />
      )}
    </PopoverMessageContext.Provider>
  )
}
