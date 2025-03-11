import { Button, ButtonProps } from "@artsy/palette-mobile"
import { RouterLinkProps, usePrefetchOnVisible } from "app/system/navigation/RouterLink"
import { Sentinel } from "app/utils/Sentinel"
import React from "react"

export type RouterButtonProps = RouterLinkProps & ButtonProps
/**
 * `Button` wrapper component that enables navigation when pressed, using the `to` prop.
 * It supports optional prefetching.
 */
export const RouterButton: React.FC<RouterButtonProps> = ({
  disablePrefetch,
  to,
  prefetchVariables,
  onPress,
  navigationProps,
  children,

  ...restProps
}) => {
  const { isPrefetchingEnabled, handlePress, handleVisible } = usePrefetchOnVisible({
    to,
    disablePrefetch,
    onPress,
    navigationProps,
    prefetchVariables,
  })

  if (!isPrefetchingEnabled) {
    return <Button onPress={handlePress} {...restProps} children={children} />
  }

  return (
    <Sentinel onChange={handleVisible}>
      <Button {...restProps} onPress={handlePress}>
        {children}
      </Button>
    </Sentinel>
  )
}
