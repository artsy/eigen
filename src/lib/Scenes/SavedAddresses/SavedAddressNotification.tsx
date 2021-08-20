import { dismissModal } from "lib/navigation/navigate"
import { AddressNotificationContext } from "lib/utils/AddressNotificationProvider"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Text } from "palette"
import { useColor } from "palette/hooks"
import React, { useContext } from "react"
import { Animated, Modal } from "react-native"

interface SavedAddressNotificationProps {
  showModal: boolean
}

export const SavedAddressNotification: React.FC<SavedAddressNotificationProps> = (props) => {
  const color = useColor()
  const notificationState = useContext(AddressNotificationContext)

  return (
    <Modal
      visible={props.showModal}
      onRequestClose={dismissModal}
      onDismiss={dismissModal}
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
              {`Address Successfully ${notificationState.action}.`}
            </Text>
          </Flex>
        </Flex>
      </Animated.View>
    </Modal>
  )
}
