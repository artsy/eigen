import { Flex, Touchable, TouchableProps } from "@artsy/palette-mobile"
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
  ...restProps
}) => {
  const prefetchUrl = usePrefetch()
  const enableViewPortPrefetching = useFeatureFlag("AREnableViewPortPrefetching")
  const [prefetchState, setPrefetchState] = useState<PrefetchState>(null)

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
    setPrefetchState("started")
    if (isPrefetchingEnabled && isVisible) {
      prefetchUrl(to, prefetchVariables, () => {
        setPrefetchState("complete")
      })
    }
  }

  const touchableProps = {
    activeOpacity: 0.65,
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
      <Sentinel onChange={handleVisible}>
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
    <Sentinel onChange={handleVisible}>
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
