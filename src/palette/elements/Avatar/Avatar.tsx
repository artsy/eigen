import { themeGet } from "@styled-system/theme-get"
import React, { ImgHTMLAttributes } from "react"
import { Image } from "react-native"
import styled from "styled-components/native"
import { borderRadius } from "styled-system"
import { Flex } from "../Flex"
import { Text } from "../Text"

const DEFAULT_SIZE = "md"

const SIZES = {
  xxs: {
    diameter: 30,
    typeSize: "13",
  },
  xs: {
    diameter: 45,
    typeSize: "13",
  },

  sm: {
    diameter: 70,
    typeSize: "16",
  },
  md: {
    diameter: 100,
    typeSize: "24",
  },
}

export interface AvatarProps extends ImgHTMLAttributes<any> {
  src?: string
  /** If an image is missing, show initials instead */
  initials?: string
  /** The size of the Avatar */
  size?: "xxs" | "xs" | "sm" | "md"
}

/** An circular Avatar component containing an image or initials */
export const Avatar = ({ src, initials, size = DEFAULT_SIZE }: AvatarProps) => {
  const { diameter, typeSize } = SIZES[size]

  if (src) {
    return (
      <Image
        resizeMode="cover"
        style={{
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
        }}
        source={{
          uri: src,
        }}
      />
    )
  }

  return (
    <InitialsHolder
      width={diameter}
      height={diameter}
      justifyContent="center"
      alignItems="center"
      borderRadius={diameter}
    >
      <Text fontSize={typeSize} lineHeight={diameter}>
        {initials}
      </Text>
    </InitialsHolder>
  )
}

/** InitialsHolder */
export const InitialsHolder = styled(Flex)`
  border: ${themeGet("colors.black10")};
  text-align: center;
  overflow: hidden;
  ${borderRadius}
`
