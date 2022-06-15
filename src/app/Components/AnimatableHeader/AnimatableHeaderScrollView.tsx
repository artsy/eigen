import { ScrollView, ScrollViewProps } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"
import { AnimatableHeaderLargeTitle } from "./AnimatableHeaderLargeTitle"
import { AnimatableHeaderShadow } from "./AnimatableHeaderShadow"

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

export const AnimatableHeaderScrollView: React.FC<ScrollViewProps> = (props) => {
  const { children, ...other } = props
  const { onScrollForAnimation } = useAnimatableHeaderContext()

  return (
    <>
      <AnimatedScrollView
        {...other}
        scrollEventThrottle={0.0000000001}
        onScroll={onScrollForAnimation}
      >
        <AnimatableHeaderLargeTitle />
        {children}
      </AnimatedScrollView>
      <AnimatableHeaderShadow />
    </>
  )
}
