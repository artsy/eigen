import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Spacer } from "palette"
import React, { ReactNode } from "react"
import { GestureResponderEvent, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { useTheme } from "../../Theme"
import { Flex, FlexProps } from "../Flex"
import { Text, useTextStyleForPalette } from "../Text"

const SIZES = {
  xxs: {
    height: 28,
    paddingRight: 10,
    paddingLeft: 10,
  },
  xs: {
    height: 40,
    paddingRight: 20,
    paddingLeft: 20,
  },
  sm: {
    height: 50,
    paddingRight: 20,
    paddingLeft: 10,
  },
}

interface PillProps extends FlexProps {
  selected?: boolean
  rounded?: boolean
  size?: "xxs" | "xs" | "sm"
  imageUrl?: string
  icon?: ReactNode
  iconPosition?: "left" | "right"
  disabled?: boolean
  onPress?: (event: GestureResponderEvent) => void
}

export const Pill: React.FC<PillProps> = ({
  children,
  size = "xxs",
  selected = true,
  rounded,
  icon,
  iconPosition = "left",
  imageUrl,
  disabled,
  onPress,
  ...other
}) => {
  const { color } = useTheme()
  const { height, paddingLeft, paddingRight } = SIZES[size]
  const textStyle = useTextStyleForPalette(size === "xxs" ? "xs" : "sm")

  const content = (
    <Flex
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      borderWidth={1}
      borderRadius={icon || rounded ? 50 : 0}
      borderColor={icon || selected ? color("black60") : color("black15")}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      height={height}
      {...other}
    >
      {iconPosition === "left" && !!icon && (
        <>
          {icon}
          <Spacer ml={1} />
        </>
      )}
      {!!imageUrl && <OpaqueImageViewContainer imageURL={imageUrl} />}
      <Text numberOfLines={1} style={textStyle}>
        {children}
      </Text>
      {iconPosition === "right" && !!icon && (
        <>
          <Spacer mr={1} />
          {icon}
        </>
      )}
    </Flex>
  )

  if (onPress) {
    return (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        {content}
      </TouchableOpacity>
    )
  }

  return content
}

export const OpaqueImageViewContainer = styled(OpaqueImageView)`
  width: 30;
  height: 30;
  border-radius: 15;
  overflow: hidden;
  margin-right: 10;
`
