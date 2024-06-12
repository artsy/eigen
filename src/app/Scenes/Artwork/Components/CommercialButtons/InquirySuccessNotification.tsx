import { Flex, Text } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { navigate } from "app/system/navigation/navigate"
import { ArtworkInquiryContext } from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import { useScreenDimensions } from "app/utils/hooks"
import React, { useContext, useEffect } from "react"
import { Animated, Modal, TouchableOpacity } from "react-native"
import styled from "styled-components/native"

export const InquirySuccessNotification: React.FC = () => {
  const { state, dispatch } = useContext(ArtworkInquiryContext)

  useEffect(() => {
    if (state.isInquirySuccessNotificationOpen) {
      const closeIn2s = setTimeout(() => {
        dispatch({ type: "closeInquirySuccessNotification" })
      }, 2000)

      return () => clearTimeout(closeIn2s)
    }
  }, [state.isInquirySuccessNotificationOpen])

  const handleRequestClose = () => {
    dispatch({ type: "closeInquirySuccessNotification" })
  }

  const handlePress = () => {
    dispatch({ type: "closeInquirySuccessNotification" })
    navigate("inbox")
  }

  return (
    <Modal
      visible={state.isInquirySuccessNotificationOpen}
      onRequestClose={handleRequestClose}
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
          <TouchableOpacity onPress={handlePress}>
            <Flex p={1} style={{ backgroundColor: "white" }}>
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
  height: 75px;
  margin: 10px;
  flex-direction: column;
  background-color: ${themeGet("colors.white100")};
  padding: 0.5px;
`
