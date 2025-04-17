import { Box, Button, Screen, Text } from "@artsy/palette-mobile"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { goBack, switchTab } from "app/system/navigation/navigate"
import { useSetWebViewCallback } from "app/utils/useWebViewEvent"
import React, { useState } from "react"
import { InteractionManager, Modal } from "react-native"

export const OfferSubmittedModal: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [offerData, setOfferData] = useState({ code: "", message: "" })

  useSetWebViewCallback<{ orderCode: string; message: string }>(
    "goToInboxOnMakeOfferSubmission",
    (args) => {
      setOfferData({ code: args.orderCode ?? "", message: args.message ?? "" })
      goBack()
      // Wait for the back animation to finish before showing the modal
      setTimeout(() => {
        setVisible(true)
      }, 2000)
    }
  )

  const onGoToInbox = () => {
    setVisible(false)
    // Go to inbox after the modal is closed
    InteractionManager.runAfterInteractions(() => {
      switchTab("inbox")
    })
  }

  const onClose = () => {
    setVisible(false)
  }

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="fade">
      <Screen>
        <NavigationHeader rightCloseButton onRightButtonPress={onClose}>
          Make Offer
        </NavigationHeader>
        <Box flex={1} py={4} px={2}>
          <Text variant="lg-display">Thank you, your offer has been submitted</Text>
          <Text variant="sm" color="mono60">
            Offer #{offerData.code}
          </Text>
          <Box mt={2} backgroundColor="mono10" p={2}>
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
