import { Flex, FlexProps, Text, TextProps, useColor } from "palette"
import React, { useRef, useState } from "react"
import { Animated, Easing, Image, TouchableOpacity } from "react-native"

export interface BannerProps {
  title: string
  text: string
  onClose?: () => void
  showCloseButton?: boolean
  containerStyle?: FlexProps
  titleStyle?: TextProps
  bodyTextStyle?: TextProps
}

export const Banner: React.FC<BannerProps> = ({
  title,
  text,
  onClose,
  showCloseButton = false,
  containerStyle,
  titleStyle,
  bodyTextStyle,
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

  return (
    <Animated.View
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
      <Flex backgroundColor={color("blue10")} {...containerStyle}>
        <Flex px={2} py={1} flexDirection="row" justifyContent="space-between">
          <Flex flex={1}>
            <Text fontSize="13px" color={color("blue100")} {...titleStyle}>
              {title}
            </Text>
            <Text fontSize="13px" color={color("black100")} {...bodyTextStyle}>
              {text}
            </Text>
          </Flex>

          {!!showCloseButton && (
            <Flex style={{ marginTop: 2 }}>
              <TouchableOpacity
                testID="banner-close-button"
                onPress={handleClose}
                hitSlop={{ bottom: 40, right: 40, left: 40, top: 40 }}
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
