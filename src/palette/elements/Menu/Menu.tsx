import React from "react"
import styled from "styled-components"

import { display, SpaceProps } from "styled-system"
import { color } from "../../helpers/color"
import { SansSize } from "../../Theme"
import { BorderBox } from "../BorderBox"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Separator } from "../Separator"
import { Spacer } from "../Spacer"
import { Sans } from "../Typography"

interface MenuProps {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  m?: SpaceProps["m"]
  py?: SpaceProps["p"]
  title?: string
  width?: number | string
}

/** Menu */
export const Menu: React.FC<MenuProps> = ({
  children,
  m = "2px",
  py = 1,
  title,
  width = 230,
  ...props
}) => {
  return (
    <MenuContainer width={width} m={m} {...props}>
      <BorderBox p={0} py={py} background="white">
        <Flex flexDirection="column" width="100%">
          {title && (
            <Box px={2} pt={1} pb={1}>
              <Sans size="3" weight="medium">
                {title}
              </Sans>
              <Spacer py={0.5} />
              <Separator />
            </Box>
          )}

          <Flex flexDirection="column">{children}</Flex>
        </Flex>
      </BorderBox>
    </MenuContainer>
  )
}

const MenuContainer = styled(Box)`
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.05);
`

// Menu Item

interface MenuItemProps extends BoxProps {
  children: React.ReactNode
  fontSize?: SansSize
  href?: string
  color?: string // TODO:  Look into type conflict with styled-system
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  px?: SpaceProps["px"]
  py?: SpaceProps["py"]
  textColor?: string
  textWeight?: "medium" | "regular"
  hasLighterTextColor?: boolean
}

/** MenuItem */
export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  fontSize = "2",
  href,
  px = 2,
  py = 1,
  textWeight = "medium",
  textColor,
  hasLighterTextColor,
  ...props
}) => {
  return (
    <MenuLink href={href} {...props} hasLighterTextColor={hasLighterTextColor}>
      <Box px={px} py={py}>
        <MenuLinkText size={fontSize} weight={textWeight} color={textColor}>
          {children}
        </MenuLinkText>
      </Box>
    </MenuLink>
  )
}

const MenuLink = styled.a<{ hasLighterTextColor: boolean }>`
  cursor: pointer;
  display: flex;
  text-decoration: none;
  display: flex;
  align-items: center;
  text-decoration: none;

  ${display};

  &:hover {
    background-color: ${p =>
      p.hasLighterTextColor ? color("black10") : color("black5")};
  }

  ${Sans} {
    display: flex;
    align-items: center;
  }
`
const MenuLinkText = styled(Sans)<{ color: string }>`
  color: ${p => p.color || color("black100")};
`
