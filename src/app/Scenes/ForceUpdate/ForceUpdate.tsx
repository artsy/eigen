import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Flex, useColor, Text, Button } from "@artsy/palette-mobile"
import { Linking, Platform } from "react-native"

interface ForceUpdateProps {
  forceUpdateMessage: string | undefined
}

const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=net.artsy.app"
const APP_STORE_URL = "https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080"

export const ForceUpdate: React.FC<ForceUpdateProps> = ({ forceUpdateMessage }) => {
  const color = useColor()
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
    <Flex flex={1} justifyContent="center" alignItems="center" px={6}>
      <ArtsyLogoIcon height={32} width={94} />
      <Text variant="xs" mt={4} textAlign="center" color={color("mono60")}>
        {forceUpdateMessage}
      </Text>
      <Button
        variant="fillGray"
        block
        size="large"
        mt={4}
        haptic="impactMedium"
        onPress={handleUpdate}
      >
        Update Artsy
      </Button>
    </Flex>
  )
}
