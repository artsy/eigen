import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import { Sentinel } from "app/utils/Sentinel"
import { useState } from "react"
import { GestureResponderEvent, TouchableOpacity } from "react-native"
import { TouchableProps } from "react-native-svg"

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
  const [isPrefetched, setIsPrefetched] = useState(false)

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

  const handleSentinelChange = (isVisible: boolean) => {
    if (isPrefetchingEnabled && isVisible && !isPrefetched) {
      prefetchUrl(to)
      setIsPrefetched(true)
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
    <Sentinel onChange={handleSentinelChange}>
      <TouchableOpacity {...touchableProps} />
    </Sentinel>
  )
}
