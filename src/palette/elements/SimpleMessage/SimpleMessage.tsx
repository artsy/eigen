import { Flex, FlexProps } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { Text } from "palette"
import { TextProps } from "palette/elements/Text"
import styled from "styled-components/native"

interface SimpleMessageProps extends FlexProps {
  children: React.ReactNode | null
  /**
   * Size of text to display in message window
   */
  variant?: TextProps["variant"]
}

const StyledFlex = styled(Flex)`
  background-color: ${themeGet("colors.black5")};
  border-radius: 2px;
`

/**
 * A generic message window for displaying ZeroStates, notices, errors, etc.
 */
export const SimpleMessage: React.FC<SimpleMessageProps> = ({
  children,
  variant = "sm",
  ...others
}) => {
  return (
    <StyledFlex p={2} {...others}>
      <Text variant={variant} color="black60">
        {children}
      </Text>
    </StyledFlex>
  )
}
