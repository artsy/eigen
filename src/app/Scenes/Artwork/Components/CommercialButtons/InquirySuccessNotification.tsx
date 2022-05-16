import { themeGet } from "@styled-system/theme-get"
import { navigate } from "app/navigation/navigate"
import { Flex, Text } from "palette"
import React, { useEffect } from "react"
import { Animated, Modal, TouchableOpacity } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import styled from "styled-components/native"

interface InquirySuccessNotificationProps {
  modalVisible: boolean
  toggleNotification: (state: boolean) => void
}

// TODO: Replace by usePopoverMessage when the floating back button is removed from the design
// See https://artsy.slack.com/archives/C02BAQ5K7/p1623332112279700
export const InquirySuccessNotification: React.FC<InquirySuccessNotificationProps> = ({
  modalVisible,
  toggleNotification,
}) => {
  let delayNotification: NodeJS.Timeout | any
  const navigateToConversation = () => {
    toggleNotification(false)
    navigate("inbox")
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
    >
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: useScreenDimensions().safeAreaInsets.top,
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
            shadowRadius: 5.0,
          }}
        >
          <TouchableOpacity onPress={navigateToConversation}>
            <Flex p={1}>
              <Flex flexDirection="row" justifyContent="space-between">
                <Text color="green100" variant="sm">
                  Message Sent
                </Text>
              </Flex>
              <Text color="black60" variant="sm">
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
  flex-direction: column;
  background-color: ${themeGet("colors.white100")};
  padding: 0.5px;
`
