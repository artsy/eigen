import { Touchable, TouchableProps } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { Sentinel } from "app/utils/Sentinel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import React, { useState } from "react"
import { GestureResponderEvent } from "react-native"
import { Variables } from "relay-runtime"

export interface RouterLinkProps {
  disablePrefetch?: boolean
  navigationProps?: Object
  to?: string | null | undefined
  // Indicates whether the child component is a touchable element, preventing duplicate touch handlers
  hasChildTouchable?: boolean
  prefetchVariables?: Variables
  children: React.ReactNode
}

/**
 * Wrapper component that enables navigation when pressed, using the `to` prop.
 * It supports optional prefetching and ensures proper touch handling for nested touchable elements.
 */
export const RouterLink: React.FC<RouterLinkProps & TouchableProps> = ({
  disablePrefetch,
  to,
  prefetchVariables,
  onPress,
  navigationProps,
  children,
  hasChildTouchable,
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

  const handleVisible = (isVisible: boolean) => {
    if (isPrefetchingEnabled && isVisible && !isPrefetched) {
      prefetchUrl(to, prefetchVariables)
      setIsPrefetched(true)
    }
  }

  const touchableProps = {
    activeOpacity: 0.65,
    onPress: handlePress,
    ...restProps,
  }

  if (!isPrefetchingEnabled) {
    return <Touchable {...touchableProps} children={children} />
  }

  if (!hasChildTouchable) {
    return (
      <Sentinel onChange={handleVisible}>
        <Touchable {...touchableProps}>{children}</Touchable>
      </Sentinel>
    )
  }

  const cloneProps = {
    onPress: handlePress,
    ...restProps,
  }

  return (
    <Sentinel onChange={handleVisible}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, cloneProps) : child
      )}
    </Sentinel>
  )
}
