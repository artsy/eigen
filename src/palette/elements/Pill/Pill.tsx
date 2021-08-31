import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { CheckIcon } from "palette"
import { CloseIcon } from "palette/svgs"
import React from "react"
import { GestureResponderEvent, TouchableOpacity } from "react-native"
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
  check?: boolean
  cross?: boolean
  size?: "xxs" | "xs" | "sm"
  image_url?: string
  onPress?: (event: GestureResponderEvent) => void
}

export const Pill: React.FC<PillProps> = ({
  children,
  size = "xxs",
  selected,
  rounded,
  check,
  cross,
  image_url,
  onPress,
  ...other
}) => {
  const { color, space } = useTheme()
  const { height, typeSize } = SIZES[size]

  const content = (
    <Flex
      flexDirection="row"
      style={{
        borderWidth: 1,
        paddingHorizontal: space(1),
        justifyContent: "center",
        alignItems: "center",
        height,
        borderRadius: check || cross || rounded ? 20 : 0,
        borderColor: check || cross || selected ? color("black60") : color("black10"),
      }}
      {...other}
    >
      {!!check && <CheckIcon fill="black100" mr={1} />}
      {!!cross && <CloseIcon fill="black100" mr={1} />}
      {!!image_url && (
        <OpaqueImageView
          imageURL={image_url}
          style={{ width: 30, height: 30, borderRadius: 15, overflow: "hidden", marginRight: 10 }}
        />
      )}
      <Text variant="small" numberOfLines={1} fontSize={typeSize}>
        {children}
      </Text>
    </Flex>
  )

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
  }

  return content
}
