import { dismissModal } from "lib/navigation/navigate"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Text } from "palette"
import { useColor } from "palette/hooks"
import React, { useEffect } from "react"
import { Animated, Modal } from "react-native"
interface SavedAddressNotificationProps {
  setNotificationState: (arg0: { notificationVisible: boolean; action: string }) => void
  showNotification: boolean
  notificationAction: string
  duration: number
}

const MODAL_OFFSET = 50

export const SavedAddressNotification: React.FC<SavedAddressNotificationProps> = (props) => {
  const { showNotification, setNotificationState, notificationAction, duration } = props
  let delayNotification: NodeJS.Timeout
  const color = useColor()
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
      onRequestClose={dismissModal}
      onDismiss={dismissModal}
      animationType="fade"
      transparent
    >
      <Animated.View
        style={{
          position: "absolute",
          top:
            notificationAction === "delete"
              ? useScreenDimensions().safeAreaInsets.top
              : useScreenDimensions().safeAreaInsets.top + MODAL_OFFSET,
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
            backgroundColor: color("green100"),
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
