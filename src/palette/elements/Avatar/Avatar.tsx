import React, { FunctionComponent, ImgHTMLAttributes } from "react"
import { Image } from "react-native"
import { borderRadius } from "styled-system"
import { color } from "../../helpers/color"
import { styledWrapper } from "../../platform/primitives"
import { Flex } from "../Flex"
import { Text, TextFontSize } from "../Text"

const IOSDiameters = {
  xs: 45,
  sm: 70,
  md: 100,
}

export interface SizeProps {
  [key: string]: {
    diameter: string
    typeSize: TextFontSize
  }
}

/** Size */
export const Size: SizeProps = {
  xs: {
    diameter: "45px",
    typeSize: "size3",
  },
  sm: {
    diameter: "70px",
    typeSize: "size6",
  },
  md: {
    diameter: "100px",
    typeSize: "size8",
  },
}

type SizeKey = "xs" | "sm" | "md"

/** sizeValue */
export const sizeValue = (size: SizeKey) => {
  switch (size) {
    case "xs":
      return Size.xs
    case "sm":
      return Size.sm
    case "md":
    default:
      return Size.md
  }
}

export interface AvatarProps extends ImgHTMLAttributes<any> {
  /** If an image is missing, show initials instead */
  initials?: string
  /** The size of the Avatar */
  size?: SizeKey
}

interface BaseAvatarProps extends AvatarProps {
  renderAvatar: () => JSX.Element
}

/** An circular Avatar component containing an image or initials */
export const BaseAvatar = ({ src, initials, size = "md", renderAvatar }: BaseAvatarProps) => {
  const { diameter, typeSize } = sizeValue(size)

  if (src) {
    return renderAvatar()
  } else if (initials) {
    // Left align for overflow
    const justifyContent = initials.length > 4 ? "left" : "center"

    return (
      <InitialsHolder
        width={diameter}
        height={diameter}
        justifyContent={justifyContent}
        alignItems="center"
        // NOTE: To make a circle in React Native:
        // you have to use a numeric value and can't use "50%"
        borderRadius={diameter}
      >
        <Text variant="mediumText" fontSize={typeSize} color="black60" lineHeight={parseInt(diameter, 10)}>
          {initials}
        </Text>
      </InitialsHolder>
    )
  } else {
    return null
  }
}

/** InitialsHolder */
export const InitialsHolder = styledWrapper(Flex)`
  background-color: ${color("black10")};
  text-align: center;
  overflow: hidden;
  ${borderRadius}
`

InitialsHolder.displayName = "InitialsHolder"

/** Avatar */
export const Avatar: FunctionComponent<AvatarProps> = ({ ...props }) => {
  const diameter = IOSDiameters[props.size || "md"]

  return (
    <BaseAvatar
      size={props.size}
      renderAvatar={() => (
        <Image
          resizeMode="stretch"
          style={{
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
          }}
          source={{
            uri: props.src,
          }}
        />
      )}
      {...props}
    />
  )
}
