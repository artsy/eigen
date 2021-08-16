import { useTheme } from "palette/Theme"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Modal, ModalProps, StyleSheet } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button } from "../Button/Button"
import { Flex } from "../Flex"
import { Text } from "../Text"

interface DialogAction {
  text: string
  action: () => void
}

interface DialogProps extends Omit<ModalProps, "animationType" | "transparent" | "statusBarTranslucent"> {
  title: string
  detail?: string
  primaryCta: DialogAction
  secondaryCta?: DialogAction
  onBackgroundPressed?: () => void
}

export const Dialog = (props: DialogProps) => {
  const { visible, title, detail, primaryCta, secondaryCta, onBackgroundPressed, ...other } = props
  const [showModal, setShowModal] = useState(visible)
  const { space, color } = useTheme()
  const value = useRef(new Animated.Value(Number(visible))).current

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
    if (visible) {
      setShowModal(true)
      fadeIn()
    } else {
      fadeOut().then(() => {
        setShowModal(false)
      })
    }
  }, [visible])

  return (
    <Modal {...other} visible={showModal} statusBarTranslucent transparent animationType="none">
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { opacity: value, backgroundColor: "rgba(194,194,194,0.5)" }]}
      />
      <SafeAreaView
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
          <Text variant="title" mb={0.5} mt={2} mx={2}>
            {title}
          </Text>
          {!!detail && (
            <ScrollView alwaysBounceVertical={false} contentContainerStyle={{ paddingHorizontal: space(2) }}>
              <Text variant="caption" color="black60">
                {detail}
              </Text>
            </ScrollView>
          )}
          <Flex mt={0.5} mb={2} mx={2} flexDirection="row" justifyContent="flex-end">
            {!!secondaryCta && (
              <Button size="small" variant="text" onPress={secondaryCta.action}>
                {secondaryCta.text}
              </Button>
            )}
            <Button size="small" ml={2} onPress={primaryCta.action}>
              {primaryCta.text}
            </Button>
          </Flex>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  )
}
