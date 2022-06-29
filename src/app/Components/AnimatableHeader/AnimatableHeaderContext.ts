import { createContext, useContext } from "react"
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { SharedValue } from "react-native-reanimated"

export interface AnimatableHeaderContextType {
  scrollOffsetY: Readonly<SharedValue<number>>
  onScrollForAnimation: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  headerHeight: number
  largeTitleVerticalOffset: number
  largeTitleHeight: number
  setLargeTitleHeight: React.Dispatch<React.SetStateAction<this["largeTitleHeight"]>>
  largeTitleEndEdge: number
  title: string
  setTitle: (title: string) => void
  titleShown: boolean
}

export const AnimatableHeaderContext = createContext<AnimatableHeaderContextType>(null as any)

export function useAnimatableHeaderContext() {
  const context = useContext(AnimatableHeaderContext)
  if (!context) {
    throw new Error("You are using useAnimatableHeaderContext outside of AnimatableHeaderProvider")
  }
  return context
}
