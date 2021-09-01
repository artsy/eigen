import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React, { ReactNode } from "react"
import { GestureResponderEvent, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { useTheme } from "../../Theme"
import { Flex, FlexProps } from "../Flex"
import { Text } from "../Text"

const SIZES = {
  xxs: {
    height: 25,
    typeSize: "12",
  },
  xs: {
    height: 35,
    typeSize: "13",
  },
  sm: {
    height: 45,
    typeSize: "16",
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
  selected,
  rounded,
  icon,
  iconPosition = "left",
  imageUrl,
  onPress,
  testID,
  ...other
}) => {
  const { color, space } = useTheme()
  const { height, typeSize } = SIZES[size]

  const content = (
    <Flex
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      borderWidth={1}
      borderRadius={icon || rounded ? 20 : 0}
      borderColor={icon || selected ? color("black60") : color("black10")}
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
    return (
      <TouchableOpacity onPress={onPress} testID={testID}>
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
