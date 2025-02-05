import { TouchableProps } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { ElementInView } from "app/utils/ElementInView"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import { GestureResponderEvent, TouchableOpacity } from "react-native"

interface RouterLinkProps {
  disablePrefetch?: boolean
  navigationProps?: Object
  to?: string | null | undefined
}

/**
 * Wrapper component around <Touchable> that navigates to a specified route (the `to` prop) when pressed.
 * `RouterLink` also supports prefetching the route when it comes into view.
 */
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

  const touchableProps = {
    activeOpacity: 0.65,
    onPress: handlePress,
    ...restProps,
  }

  if (!isPrefetchingEnabled) {
    return <TouchableOpacity {...touchableProps} />
  }

  return (
    <ElementInView onVisible={handleVisible}>
      <TouchableOpacity {...touchableProps} />
    </ElementInView>
  )
}
