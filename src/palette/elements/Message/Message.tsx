import { Color } from "@artsy/palette-tokens/dist/themes/v3"
import { Image } from "app/Components/Bidding/Elements/Image"
import { Flex, FlexProps, Text, TextProps, useColor } from "palette"
import React, { useRef, useState } from "react"
import { Animated, Easing, TouchableOpacity } from "react-native"

type MessageVariant = "default" | "info" | "success" | "warning" | "error"

export interface MessageProps {
  bodyTextStyle?: TextProps
  containerStyle?: FlexProps
  IconComponent?: React.FC<any>
  onClose?: () => void
  showCloseButton?: boolean
  testID?: string
  text?: string
  title: string
  titleStyle?: TextProps
  variant?: MessageVariant
}

export const Message: React.FC<MessageProps> = ({
  bodyTextStyle,
  containerStyle,
  IconComponent,
  onClose,
  showCloseButton = false,
  testID,
  text,
  title,
  titleStyle,
  variant = "default",
}) => {
  const color = useColor()

  const [tempHeight, setTempHeight] = useState<number | undefined>(undefined)

  const scaleYAnim = useRef(new Animated.Value(0)).current

  const handleClose = () => {
    Animated.timing(scaleYAnim, {
      toValue: 1,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setTempHeight(0)
    })

    onClose?.()
  }

  const colors: {
    [key: string]: { [key: string]: Color }
  } = {
    default: {
      backgroundColor: "black10",
      titleColor: "black100",
      textColor: "black100",
    },
    info: {
      backgroundColor: "blue10",
      titleColor: "blue100",
      textColor: "black100",
    },
    success: {
      backgroundColor: "green10",
      titleColor: "green100",
      textColor: "black100",
    },
    warning: {
      backgroundColor: "copper10",
      titleColor: "copper100",
      textColor: "black100",
    },
    error: {
      backgroundColor: "red10",
      titleColor: "red100",
      textColor: "black100",
    },
  }

  return (
    <Animated.View
      testID={testID}
      style={{
        height: tempHeight,
        transform: [
          {
            scaleY: scaleYAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ],
      }}
    >
      <Flex backgroundColor={color(colors[variant].backgroundColor)} {...containerStyle}>
        <Flex px={2} py={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={1}>
            <Flex flexDirection="row">
              {!!IconComponent && (
                <Flex mr={1}>
                  <IconComponent />
                </Flex>
              )}
              <Text pr={2} variant="xs" color={color(colors[variant].titleColor)} {...titleStyle}>
                {title}
              </Text>
            </Flex>
            {!!text && (
              <Text variant="xs" color={color(colors[variant].textColor)} {...bodyTextStyle}>
                {text}
              </Text>
            )}
          </Flex>

          {!!showCloseButton && (
            <Flex style={{ marginTop: 2 }}>
              <TouchableOpacity
                testID="Message-close-button"
                onPress={handleClose}
                hitSlop={{ bottom: 10, right: 10, left: 10, top: 10 }}
              >
                <Image
                  source={require("images/close-x.webp")}
                  style={{ tintColor: color("black100") }}
                />
              </TouchableOpacity>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Animated.View>
  )
}
