import { Flex, useColor } from "@artsy/palette-mobile"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { createContext, useContext, useMemo } from "react"
import { View, ViewStyle } from "react-native"
import { useScreenDimensions } from "shared/hooks"

type PlaceholderContextValue = {}

const PlaceholderContext = createContext<PlaceholderContextValue>(null as any)

export function usePlaceholderContext() {
  const context = useContext(PlaceholderContext)
  if (!context) {
    throw new Error("You're using a Placeholder outside of a PlaceholderContext")
  }
  return context
}

export const ProvidePlaceholderContext: React.FC = ({ children }) => (
  <PlaceholderContext.Provider value={{}}>{children}</PlaceholderContext.Provider>
)

// if we ever want to do some fancy skeleton, this code seems pretty simple and nice.
// https://github.com/asaeed14/react-native-animated-skeleton/blob/master/src/Skeleton/useSkeletonAnimation.ts

export const PlaceholderBox: React.FC<ViewStyle> = ({ children, ...styles }) => {
  const color = useColor()

  return (
    <View style={[{ borderRadius: 2, backgroundColor: color("black10") }, styles]}>{children}</View>
  )
}

const TEXT_HEIGHT = 12
const TEXT_MARGIN = 7

export const PlaceholderText: React.FC<ViewStyle> = ({ ...props }) => (
  <PlaceholderBox height={TEXT_HEIGHT} marginBottom={TEXT_MARGIN} {...props} />
)

export const useMemoizedRandom = () => useMemo(Math.random, [])

/**
 * Placeholder with memoized random with between `minWidth` and `maxWidth`.
 */
export const RandomWidthPlaceholderText: React.FC<
  ViewStyle & { minWidth: number; maxWidth: number }
> = ({ minWidth, maxWidth, ...props }) => (
  <PlaceholderText width={minWidth + useMemoizedRandom() * (maxWidth - minWidth)} {...props} />
)

const BUTTON_HEIGHT = 42

export const PlaceholderButton: React.FC<ViewStyle> = ({ ...props }) => {
  return <PlaceholderBox height={BUTTON_HEIGHT} {...props} />
}

export class RandomNumberGenerator {
  constructor(private seed: number) {
    for (let i = 0; i < 100; i++) {
      this.seed = this.next()
    }
  }

  next(arg?: { from: number; to: number }) {
    const y = Math.sin(this.seed++) * 10000
    const result = y - Math.floor(y)
    if (arg) {
      return Math.min(arg.from, arg.to) + result * Math.abs(arg.to - arg.from)
    }
    return result
  }
}

export const PlaceholderRaggedText = ({
  numLines,
  seed = 10,
  textHeight = TEXT_HEIGHT,
}: {
  numLines: number
  seed?: number
  textHeight?: number
}) => {
  const lengths = useMemo(() => {
    // create our own little deterministic math.random() to avoid snapshot churn
    const rng = new RandomNumberGenerator(seed)

    const result = []
    for (let i = 0; i < numLines - 1; i++) {
      result.push(rng.next() * 0.15 + 0.85)
    }
    result.push(rng.next() * 0.3 + 0.2)
    return result
  }, [numLines])

  return (
    <View style={{ justifyContent: "flex-start" }}>
      {lengths.map((length, key) => (
        <View key={key} style={{ flexDirection: "row" }}>
          <PlaceholderText height={textHeight} flex={length} />
        </View>
      ))}
    </View>
  )
}

export const PlaceholderImage = ({ height }: { height: number }) => (
  <View>
    <PlaceholderBox height={height} />
    <View style={{ marginBottom: 20 }} />
    <PlaceholderRaggedText numLines={2} seed={height} />
    <View style={{ marginBottom: 20 }} />
  </View>
)

export const PlaceholderGrid = () => (
  <Flex mx={2} flexDirection="row">
    <GenericGridPlaceholder width={useScreenDimensions().width - 40} />
  </Flex>
)
