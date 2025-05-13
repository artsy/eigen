import { Flex, Touchable, TouchableProps } from "@artsy/palette-mobile"
import { navigate, NavigateOptions } from "app/system/navigation/navigate"
import { Sentinel } from "app/utils/Sentinel"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePrefetch } from "app/utils/queryPrefetching"
import React, { useState } from "react"
import { GestureResponderEvent } from "react-native"
import { Variables } from "relay-runtime"

export interface RouterLinkProps {
  disablePrefetch?: boolean
  navigationProps?: NavigateOptions["passProps"]
  isWeb?: boolean
  to?: string | null | undefined
  // Indicates whether the child component is a touchable element, preventing duplicate touch handlers
  hasChildTouchable?: boolean
  prefetchVariables?: Variables
  children: React.ReactNode
}

type PrefetchState = "started" | "complete" | null

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
  isWeb,
  ...restProps
}) => {
  const enablePrefetchingIndicator = useDevToggle("DTShowPrefetchingIndicator")
  const prefetchUrl = usePrefetch()
  const enableViewPortPrefetching = useFeatureFlag("AREnableViewPortPrefetching")
  const [prefetchState, setPrefetchState] = useState<PrefetchState>(null)

  const isPrefetchingEnabled = !isWeb && !disablePrefetch && enableViewPortPrefetching && to

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event)

    if (!to) return

    const navigationOptions: NavigateOptions = {}

    if (navigationProps) {
      navigationOptions.passProps = navigationProps
    }

    if (isWeb) {
      navigationOptions.modal = true
    }

    // check if there's any navigation options
    if (Object.keys(navigationOptions).length > 0) {
      navigate(to, navigationOptions)
    } else {
      navigate(to)
    }
  }

  const handleVisible = (isVisible: boolean) => {
    if (isPrefetchingEnabled && isVisible) {
      if (enablePrefetchingIndicator) setPrefetchState("started")

      prefetchUrl(to, prefetchVariables, () => {
        if (enablePrefetchingIndicator) setPrefetchState("complete")
      })
    }
  }

  const touchableProps = {
    onPress: handlePress,
    ...restProps,
  }

  const cloneProps = {
    ...restProps,
    onPress: handlePress,
  }

  // If the child component is a touchable element, we don't add another touchable wrapper
  if (hasChildTouchable && isPrefetchingEnabled) {
    return (
      <Sentinel onChange={handleVisible} threshold={0}>
        <Border prefetchState={prefetchState}>
          {React.Children.map(children, (child) => {
            return React.isValidElement(child) ? React.cloneElement(child, cloneProps) : child
          })}
        </Border>
      </Sentinel>
    )
  }

  if (hasChildTouchable && !isPrefetchingEnabled) {
    return (
      <>
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, cloneProps) : child
        )}
      </>
    )
  }

  if (!isPrefetchingEnabled) {
    return <Touchable {...touchableProps} children={children} />
  }

  return (
    <Sentinel onChange={handleVisible} threshold={0}>
      <Border prefetchState={prefetchState}>
        <Touchable {...touchableProps}>{children}</Touchable>
      </Border>
    </Sentinel>
  )
}

const Border: React.FC<{ prefetchState: PrefetchState }> = ({ children, prefetchState }) => {
  if (!prefetchState) {
    return <>{children}</>
  }

  const borderColor = prefetchState === "complete" ? "green" : "yellow"

  return (
    <Flex border={`1px dotted ${borderColor}`} display="inline">
      {children}
    </Flex>
  )
}
