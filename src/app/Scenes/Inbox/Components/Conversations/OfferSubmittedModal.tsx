import { Box, Button, Text } from "@artsy/palette-mobile"
import { NavigationContainer } from "@react-navigation/native"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack, switchTab } from "app/system/navigation/navigate"
import { useSetWebViewCallback } from "app/utils/useWebViewEvent"
import React, { useState } from "react"

export const OfferSubmittedModal: React.FC = (props) => {
  const [visible, setVisible] = useState(false)
  const [offerData, setOfferData] = useState({ code: "", message: "" })

  useSetWebViewCallback<{ orderCode: string; message: string }>(
    "goToInboxOnMakeOfferSubmission",
    (args) => {
      setOfferData({ code: args.orderCode ?? "", message: args.message ?? "" })
      goBack()
      setVisible(true)
    }
  )

  const onGoToInbox = () => {
    switchTab("inbox")
    setVisible(false)
  }

  const onClose = () => {
    setVisible(false)
  }

  return (
    <NavigationContainer independent {...props}>
      <FancyModal visible={visible} onBackgroundPressed={onClose}>
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
      </FancyModal>
    </NavigationContainer>
  )
}
