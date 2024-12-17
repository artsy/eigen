import { Touchable, TouchableProps } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { ElementInView } from "app/utils/ElementInView"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import { GestureResponderEvent } from "react-native"

interface RouterLinkProps {
  disablePrefetch?: boolean
  passProps?: Object
  to: string | null | undefined
}

export const RouterLink: React.FC<RouterLinkProps & TouchableProps> = ({
  disablePrefetch,
  to,
  onPress,
  passProps,
  ...restProps
}) => {
  const prefetchUrl = usePrefetch()
  const enableViewPortPrefetching = useFeatureFlag("AREnableViewPortPrefetching")

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event)

    if (to) {
      navigate(to, { passProps })
    }
  }

  const handleVisible = () => {
    if (!disablePrefetch && enableViewPortPrefetching && to) {
      prefetchUrl(to)
    }
  }

  return (
    <ElementInView onVisible={handleVisible}>
      <Touchable {...restProps} onPress={handlePress} />
    </ElementInView>
  )
}
