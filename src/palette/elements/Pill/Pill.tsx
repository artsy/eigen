import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React, { ReactNode } from "react"
import { GestureResponderEvent, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { useTheme } from "../../Theme"
import { Flex, FlexProps } from "../Flex"
import { Text } from "../Text"

const SIZES = {
  xxs: {
    height: 28,
    typeSize: 13,
  },
  xs: {
    height: 40,
    typeSize: 16,
  },
  sm: {
    height: 50,
    typeSize: 16,
  },
}

interface PillProps extends FlexProps {
  selected?: boolean
  rounded?: boolean
  size?: "xxs" | "xs" | "sm"
  imageUrl?: string
  icon?: ReactNode
  iconPosition?: "left" | "right"
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
  onPress,
  ...other
}) => {
  const { colorV3, space } = useTheme()
  const { height, typeSize } = SIZES[size]

  const content = (
    <Flex
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      borderWidth={1}
      borderRadius={icon || rounded ? 50 : 0}
      borderColor={icon || selected ? colorV3("black60") : colorV3("black15")}
      style={{
        paddingHorizontal: space(1),
        height,
      }}
      {...other}
    >
      {iconPosition === "left" && icon}
      {!!imageUrl && <OpaqueImageViewContainer imageURL={imageUrl} />}
      <Text variant="small" numberOfLines={1} fontSize={typeSize}>
        {children}
      </Text>
      {iconPosition === "right" && icon}
    </Flex>
  )

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
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
