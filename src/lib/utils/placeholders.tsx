import { color } from "@artsy/palette"
import React, { useContext, useEffect, useMemo, useRef } from "react"
import { View, ViewStyle } from "react-native"
import Animated from "react-native-reanimated"

const PlaceholderContext = React.createContext<{ clock: Animated.Clock }>(null)

function useCurrentTime() {
  const isMounted = useMemo(() => {
    return new Animated.Value(1 as number)
  }, [])
  const clock = useMemo(() => {
    return new Animated.Clock()
  }, [])
  useEffect(() => {
    // isMounted starts as true so nothing to do here
    return () => {
      // this is called when the component unmounts
      isMounted.setValue(0)
    }
  }, [])
  Animated.useCode(
    () => Animated.onChange(isMounted, Animated.cond(isMounted, Animated.startClock(clock), Animated.stopClock(clock))),
    []
  )
  return clock
}

export const ProvidePlaceholderContext: React.FC<{}> = ({ children }) => {
  const clock = useCurrentTime()
  return <PlaceholderContext.Provider value={{ clock }} children={children} />
}

export const Placeholder: React.FC<ViewStyle> = styles => {
  const ctx = useContext(PlaceholderContext)
  if (!ctx) {
    throw new Error("You're using a Placeholder outside of a PlaceholderContext")
  }
  const { clock } = ctx
  const verticalOffset = useMemo(() => {
    return new Animated.Value(0 as number)
  }, [])
  const { opacity } = useMemo(() => {
    const offsetClock = Animated.sub(clock, Animated.divide(verticalOffset, 2))
    const scaledClock = Animated.divide(offsetClock, 230)
    const pulse = Animated.sin(scaledClock)
    return { opacity: Animated.sub(1, Animated.divide(pulse, 3)) }
  }, [])
  const ref = useRef<Animated.View>()
  return (
    <Animated.View
      ref={ref}
      style={[{ borderRadius: 2 }, styles, { opacity, backgroundColor: color("black10") }] as any}
      onLayout={() => {
        ref.current.getNode().measureInWindow((_w, h, _x, y) => {
          verticalOffset.setValue(-y + h / 2)
        })
      }}
    />
  )
}

export const RaggedText: React.FC<{ numLines: number }> = ({ numLines }) => {
  const marginHeight = 7
  const textHeight = 12
  const lengths = useMemo(() => {
    const result = []
    for (let i = 0; i < numLines - 1; i++) {
      result.push(Math.random() * 0.15 + 0.85)
    }
    result.push(Math.random() * 0.3 + 0.2)
    return result
  }, [numLines])

  return (
    <View
      style={{ flexDirection: "column", justifyContent: "flex-start", height: (marginHeight + textHeight) * numLines }}
    >
      {lengths.map((length, key) => (
        <View key={key} style={{ flexDirection: "row", marginBottom: marginHeight, height: textHeight }}>
          <Placeholder flex={length} />
        </View>
      ))}
    </View>
  )
}
