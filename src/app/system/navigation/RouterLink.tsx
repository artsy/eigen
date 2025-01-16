import { Touchable, TouchableProps } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { ElementInView } from "app/utils/ElementInView"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import { GestureResponderEvent } from "react-native"

interface RouterLinkProps {
  disablePrefetch?: boolean
  navigationProps?: Object
  to?: string | null | undefined
}

export const RouterLink: React.FC<RouterLinkProps & TouchableProps> = ({
  disablePrefetch,
  to,
  onPress,
  navigationProps,
  ...restProps
}) => {
  const prefetchUrl = usePrefetch()
  const enableViewPortPrefetching = useFeatureFlag("AREnableViewPortPrefetching")

  const isPrefetchingEnabled = !disablePrefetch && enableViewPortPrefetching && to

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event)

    if (!to) return

    if (navigationProps) {
      navigate(to, { passProps: navigationProps })
    } else {
      navigate(to)
    }
  }

  const handleVisible = () => {
    if (isPrefetchingEnabled) {
      prefetchUrl(to)
    }
  }

  if (!isPrefetchingEnabled) {
    return <Touchable {...restProps} onPress={handlePress} />
  }

  return (
    <ElementInView onVisible={handleVisible}>
      <Touchable {...restProps} onPress={handlePress} />
    </ElementInView>
  )
}
