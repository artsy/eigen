import { Button, ButtonProps } from "@artsy/palette-mobile"
import { RouterLinkComponent, RouterLinkComponentProps } from "app/system/navigation/RouterLink"
import React from "react"

export type RouterButtonProps = RouterLinkComponentProps & ButtonProps

/**
 * `Button` wrapper component that enables navigation when pressed, using the `to` prop.
 * It supports optional prefetching.
 */
export const RouterButton: React.FC<RouterButtonProps> = ({ ...restProps }) => {
  return <RouterLinkComponent<ButtonProps> {...restProps} TouchableWrapper={Button} />
}
