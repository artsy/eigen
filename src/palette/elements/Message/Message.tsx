import { themeGet } from "@styled-system/theme-get"
import React from "react"
import { useColor } from "../../hooks"
import { styledWrapper } from "../../platform/primitives"
import { SansSize } from "../../Theme"
import { Flex, FlexProps } from "../Flex"
import { Sans } from "../Typography"

interface MessageProps extends FlexProps {
  children: React.ReactNode | null
  /**
   * Size of text to display in message window
   */
  textSize?: SansSize
}

const StyledFlex = styledWrapper(Flex)`
  background-color: ${themeGet("colors.black5")};
  border-radius: 2px;
`

/**
 * A generic message window for displaying ZerStates, notices, errors, etc.
 */
export const Message: React.FC<MessageProps> = ({ children, textSize = "3t", ...others }) => {
  const color = useColor()
  return (
    <StyledFlex p={2} {...others}>
      <Sans size={textSize} color={color("black60")} weight="regular">
        {children}
      </Sans>
    </StyledFlex>
  )
}
