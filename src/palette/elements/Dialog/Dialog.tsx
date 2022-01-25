import { useTheme } from "palette/Theme"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Modal, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button } from "../Button"
import { Flex } from "../Flex"
import { Text } from "../Text"

interface DialogAction {
  text: string
  onPress: () => void
}

export interface DialogProps {
  isVisible: boolean
  title: string
  detail?: string
  primaryCta: DialogAction
  secondaryCta?: DialogAction
  onBackgroundPress?: () => void
}

export const Dialog = (props: DialogProps) => {
  const { isVisible, title, detail, primaryCta, secondaryCta, onBackgroundPress, ...other } = props
  const [visible, setVisible] = useState(isVisible)
  const { space, color } = useTheme()
  const value = useRef(new Animated.Value(Number(isVisible))).current

  const fadeIn = () => {
    return new Promise((resolve) => {
      Animated.timing(value, {
        toValue: 1,
        useNativeDriver: true,
        duration: 180,
      }).start(resolve)
    })
  }

  const fadeOut = () => {
    return new Promise((resolve) => {
      Animated.timing(value, {
        toValue: 0,
        useNativeDriver: true,
        duration: 150,
      }).start(resolve)
    })
  }

  useEffect(() => {
    if (isVisible) {
      setVisible(true)
      fadeIn()
    } else {
      fadeOut().then(() => {
        setVisible(false)
      })
    }
  }, [isVisible])

  const backdrop = (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        { opacity: value, backgroundColor: "rgba(194,194,194,0.5)" },
      ]}
    />
  )

  return (
    <Modal {...other} visible={visible} statusBarTranslucent transparent animationType="none">
      {!!onBackgroundPress ? (
        <TouchableWithoutFeedback testID="dialog-backdrop" onPress={onBackgroundPress}>
          {backdrop}
        </TouchableWithoutFeedback>
      ) : (
        backdrop
      )}
      <SafeAreaView
        pointerEvents="box-none"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: space(2),
          backgroundColor: "transparent",
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            maxHeight: "100%",
            opacity: value,
            backgroundColor: color("white100"),
            borderWidth: 1,
            borderColor: color("black5"),
            shadowColor: "rgba(0, 0, 0, 0.06)",
            shadowOffset: {
              height: 2,
              width: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 10,
          }}
        >
          <Text testID="dialog-title" variant="md" mb={0.5} mt={2} mx={2}>
            {title}
          </Text>
          {!!detail && (
            <ScrollView
              alwaysBounceVertical={false}
              contentContainerStyle={{ paddingHorizontal: space(2) }}
            >
              <Text testID="dialog-detail" variant="sm" color="black60">
                {detail}
              </Text>
            </ScrollView>
          )}
          <Flex mt={2} mb={2} mx={2} flexDirection="row" justifyContent="flex-end">
            {!!secondaryCta && (
              <Button
                size="small"
                testID="dialog-secondary-action-button"
                variant="text"
                onPress={secondaryCta.onPress}
              >
                {secondaryCta.text}
              </Button>
            )}
            <Button
              size="small"
              variant="fillDark"
              testID="dialog-primary-action-button"
              ml={2}
              onPress={primaryCta.onPress}
            >
              {primaryCta.text}
            </Button>
          </Flex>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  )
}
