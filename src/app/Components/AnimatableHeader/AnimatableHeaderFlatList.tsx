import { FlatList, FlatListProps } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"
import { AnimatableHeaderLargeTitle } from "./AnimatableHeaderLargeTitle"
import { AnimatableHeaderShadow } from "./AnimatableHeaderShadow"

export const AnimatableHeaderFlatList = <T extends any>(props: FlatListProps<T>) => {
  const { ListHeaderComponent, ...rest } = props
  const { onScrollForAnimation } = useAnimatableHeaderContext()

  return (
    <>
      <FlatList<T>
        {...rest}
        renderScrollComponent={(p) => <Animated.ScrollView {...p} />}
        scrollEventThrottle={0.0000000001}
        ListHeaderComponent={
          <>
            <AnimatableHeaderLargeTitle />
            {ListHeaderComponent}
          </>
        }
        onScroll={onScrollForAnimation}
      />
      <AnimatableHeaderShadow />
    </>
  )
}
