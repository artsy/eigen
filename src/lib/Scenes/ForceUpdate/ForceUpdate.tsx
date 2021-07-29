import { ArtsyLogoIcon, Button, color, Flex, Text } from "palette"
import React from "react"
import { Linking, Platform } from "react-native"

interface ForceUpdateProps {
  forceUpdateMessage: string | undefined
}

const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=net.artsy.app"
const APP_STORE_URL = "https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080"

export const ForceUpdate: React.FC<ForceUpdateProps> = ({ forceUpdateMessage }) => {
  const handleUpdate = () => {
    const storeURL = Platform.OS === "android" ? PLAYSTORE_URL : APP_STORE_URL
    Linking.canOpenURL(storeURL).then(
      (supported) => {
        if (supported) {
          Linking.openURL(storeURL)
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }

  return (
    <Flex flex={1} justifyContent="center" alignItems="center" px={5}>
      <ArtsyLogoIcon />
      <Text variant="caption" mt={3} textAlign="center" color={color("black60")}>
        {forceUpdateMessage}
      </Text>
      <Button variant="secondaryGray" block size="large" mt={3} haptic="impactMedium" onPress={handleUpdate}>
        Update Artsy
      </Button>
    </Flex>
  )
}
