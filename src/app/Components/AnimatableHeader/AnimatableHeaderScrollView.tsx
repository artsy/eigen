import { ScrollViewProps } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"
import { AnimatableHeaderLargeTitle } from "./AnimatableHeaderLargeTitle"
import { AnimatableHeaderShadow } from "./AnimatableHeaderShadow"

export const AnimatableHeaderScrollView: React.FC<ScrollViewProps> = (props) => {
  const { children, ...other } = props
  const { onScrollForAnimation } = useAnimatableHeaderContext()

  return (
    <>
      <Animated.ScrollView
        {...other}
        scrollEventThrottle={0.0000000001}
        onScroll={onScrollForAnimation}
      >
        <AnimatableHeaderLargeTitle />
        {children}
      </Animated.ScrollView>
      <AnimatableHeaderShadow />
    </>
  )
}
