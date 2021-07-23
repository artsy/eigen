import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { color, Flex, Text } from "palette"
import React, { useEffect } from "react"
import { Animated, Modal, TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface SavedAddressNotificationProps {
  setNotificationState: (arg0: { notificationVisible: boolean; action: string }) => void
  showNotification: boolean
  notificationAction: string
  duration: number
}

export const SavedAddressNotification: React.FC<SavedAddressNotificationProps> = (props) => {
  const { showNotification, setNotificationState, notificationAction, duration } = props
  let delayNotification: NodeJS.Timeout

  useEffect(() => {
    delayNotification = setTimeout(() => {
      setNotificationState({ notificationVisible: false, action: "" })
    }, duration)
    return () => {
      clearTimeout(delayNotification)
    }
  }, [showNotification])

  return (
    <Modal
      visible={showNotification}
      onRequestClose={() => setNotificationState({ notificationVisible: false, action: "" })}
      animationType="fade"
      transparent
    >
      <Animated.View
        style={{
          position: "absolute",
          top: useScreenDimensions().safeAreaInsets.top,
          width: useScreenDimensions().width - 20,
          height: 60,
          zIndex: 5,
          left: 10,
          flexDirection: "column",
        }}
      >
        <Flex
          m={1}
          style={{
            backgroundColor: color("black100"),
            position: "relative",
            flexDirection: "column",
            zIndex: 5,
            height: 60,
            margin: 10,
            padding: 0.5,
          }}
        >
          <Flex p={2} flexDirection="row" justifyContent="space-between">
            <Text color={color("white100")} variant="title">
              {`Address Successfully ${notificationAction}.`}
            </Text>
          </Flex>
        </Flex>
      </Animated.View>
    </Modal>
  )
}
