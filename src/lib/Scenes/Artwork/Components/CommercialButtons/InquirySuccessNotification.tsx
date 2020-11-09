import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { CloseIcon, Flex, Text } from "palette"
import React, { useEffect, useRef } from "react"
import { Animated, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

interface InquirySuccessNotificationProps {
  modalVisible: boolean
  toggleNotification: (state: boolean) => void
}

export const InquirySuccessNotification: React.FC<InquirySuccessNotificationProps> = ({
  modalVisible,
  toggleNotification,
}) => {
  let delayNotification: NodeJS.Timeout | any
  const navRef = useRef(null)
  const navigateToConversation = () => {
    toggleNotification(false)
    SwitchBoard.presentNavigationViewController(navRef as any, "inbox")
  }

  useEffect(() => {
    delayNotification = setTimeout(() => {
      toggleNotification(false)
    }, 2000)
    return () => {
      clearTimeout(delayNotification)
    }
  }, [modalVisible])

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={() => toggleNotification(false)}
      animationType="fade"
      transparent
      ref={navRef}
    >
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "95%",
        }}
      >
        <SuccessfulInquirySentContainer
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
          }}
          p={0.5}
          bg="white100"
          flexDirection="row"
        >
          <TouchableOpacity onPress={navigateToConversation}>
            <Flex ml={1}>
              <Flex flexDirection="row" justifyContent="space-between">
                <Text color="green100" variant="mediumText">
                  Message Sent
                </Text>
                <TouchableWithoutFeedback
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => toggleNotification(false)}
                >
                  <CloseIcon />
                </TouchableWithoutFeedback>
              </Flex>
              <Text color="black60" variant="text">
                Expect a response within 1-3 business days.
              </Text>
            </Flex>
          </TouchableOpacity>
        </SuccessfulInquirySentContainer>
      </Animated.View>
    </Modal>
  )
}

const SuccessfulInquirySentContainer = styled(Flex)`
  position: relative;
  z-index: 5;
  height: 65px;
  margin: 10px;
  top: 0;
  flex-direction: column;
`
