import { ArtworkInquiryContext } from "lib/utils/ArtworkInquiry/ArtworkInquiryStore"
import React, { useContext, useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"

interface NotificationProps {
  notification?: {
    message: string
    title: string
  }
  messageSent?: boolean
}

export const InquiryNotification: React.FC<NotificationProps> = () => {
  const { state, dispatch } = useContext(ArtworkInquiryContext)

  useEffect(() => {
    const delay = setTimeout(() => {
      // TODO: This should actually be called after the send message mutatation returns a non-error response
      // but for now it's just rendering in the view after 5 seconds since PURCHASE-2098 is still in progress.
      dispatch({ type: "showMessageSentNotification", payload: true })
    }, 5000)
    return () => clearTimeout(delay)
  }, [])

  // Hide the notificaton then nav to the inbox view.
  const navigateToInquiry = () => {
    dispatch({ type: "showMessageSentNotification", payload: false })
  }

  return state.showMessageSentNotification ? (
    <View>
      <TouchableOpacity onPress={navigateToInquiry}>
        <View>
          <Text numberOfLines={1}>Message sent</Text>
          <Text numberOfLines={2}>Expect a response withing 1-3 business days.</Text>
        </View>
      </TouchableOpacity>
    </View>
  ) : null
}
