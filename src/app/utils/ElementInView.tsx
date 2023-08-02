import { FC, useEffect, useRef, useState } from "react"
import { View, useWindowDimensions } from "react-native"

const DEFAULT_INTERVAL = 400
const VISIBILITY_MARGIN = 50

type ElementInViewProps = { onVisible: () => void; visibilityMargin?: number; delay?: number }

export const ElementInView: FC<ElementInViewProps> = ({
  children,
  onVisible,
  visibilityMargin = VISIBILITY_MARGIN,
  delay = DEFAULT_INTERVAL,
}) => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<View>(null)
  const { height: windowHeight } = useWindowDimensions()

  useEffect(() => {
    if (!ref?.current || visible) {
      return
    }

    const interval = setInterval(() => {
      if (!ref.current) {
        return
      }

      ref.current.measure((_, __, ___, height, ____, pageY) => {
        const elementRectBottom = pageY + height
        if (elementRectBottom + visibilityMargin < windowHeight) {
          setVisible(true)
          onVisible()
        }
      })
    }, delay)

    return () => clearInterval(interval)
  }, [visible, windowHeight])

  return (
    <View ref={ref} onLayout={() => {}}>
      {children}
    </View>
  )
}
