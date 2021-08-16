import { useTheme } from "palette/Theme"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Modal, ModalProps, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button } from "../Button/Button"
import { Flex } from "../Flex"
import { Text } from "../Text"

interface DialogAction {
  text: string
  action: () => void
}

interface DialogProps extends Omit<ModalProps, "animationType" | "transparent"> {
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
    <Modal {...other} visible={showModal} transparent={true} animationType="none">
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: value, backgroundColor: "rgba(194,194,194,0.5)" }]}
        />
        <View style={[StyleSheet.absoluteFillObject, { justifyContent: "center", alignItems: "center", padding: 10 }]}>
          <Animated.View
            style={{
              opacity: value,
              width: "100%",
              height: "95%",
              marginHorizontal: space(2),
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: color("white100"),
                borderWidth: 1,
                borderColor: color("black5"),
                width: "100%",
                padding: space(2),
                shadowColor: "rgba(0, 0, 0, 0.06)",
                shadowOffset: {
                  height: 2,
                  width: 0,
                },
                shadowOpacity: 1,
                shadowRadius: 10,
              }}
            >
              <Text variant="title" mb={0.5}>
                {title}
              </Text>
              {!!detail && (
                <Text variant="caption" color="black60">
                  {detail}
                </Text>
              )}
              <Flex mt={0.5} flexDirection="row" justifyContent="flex-end">
                {!!secondaryCta && (
                  <Button size="small" variant="text" onPress={secondaryCta.action}>
                    {secondaryCta.text}
                  </Button>
                )}
                <Button size="small" ml={2} onPress={primaryCta.action}>
                  {primaryCta.text}
                </Button>
              </Flex>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
