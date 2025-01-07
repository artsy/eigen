import { Box, Button, Screen, Text } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack, switchTab } from "app/system/navigation/navigate"
import { useSetWebViewCallback } from "app/utils/useWebViewEvent"
import React, { useState } from "react"
import { Modal } from "react-native"

export const OfferSubmittedModal: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [offerData, setOfferData] = useState({ code: "", message: "" })

  useSetWebViewCallback<{ orderCode: string; message: string }>(
    "goToInboxOnMakeOfferSubmission",
    (args) => {
      setOfferData({ code: args.orderCode ?? "", message: args.message ?? "" })
      goBack()
      // Wait for the back animation to finish before showing the modal
      requestAnimationFrame(() => {
        setVisible(true)
      })
    }
  )

  const onGoToInbox = () => {
    setVisible(false)
    // Go to inbox after the modal is closed
    requestAnimationFrame(() => {
      switchTab("inbox")
    })
  }

  const onClose = () => {
    setVisible(false)
  }

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="fade" statusBarTranslucent>
      <Screen>
        <FancyModalHeader rightCloseButton onRightButtonPress={onClose}>
          Make Offer
        </FancyModalHeader>
        <Box flex={1} py={4} px={2}>
          <Text variant="lg-display">Thank you, your offer has been submitted</Text>
          <Text variant="sm" color="black60">
            Offer #{offerData.code}
          </Text>
          <Box mt={2} backgroundColor="black10" p={2}>
            <Text>{offerData.message}</Text>
          </Box>
          <Text mt={2}>Negotiation with the gallery will continue in the Inbox.</Text>
          <Button variant="fillDark" block my={2} onPress={onGoToInbox}>
            Go to inbox
          </Button>
        </Box>
      </Screen>
    </Modal>
  )
}
