import { ArtsyLogoIcon } from "@artsy/icons/native"
import { Flex, useColor, Text, Button } from "@artsy/palette-mobile"
import { getBuildNumber, getAppVersion } from "app/utils/appVersion"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { appJson } from "app/utils/jsonFiles"
import { Linking, Platform } from "react-native"
import DeviceInfo from "react-native-device-info"

interface ForceUpdateProps {
  forceUpdateMessage: string | undefined
}

const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=net.artsy.app"
const APP_STORE_URL = "https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080"

export const ForceUpdate: React.FC<ForceUpdateProps> = ({ forceUpdateMessage }) => {
  const isStaging = useIsStaging()
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
      {!!isStaging && (
        <>
          <Text variant="xs" color="devpurple">
            DeviceInfo Version: {DeviceInfo.getVersion()}
          </Text>
          <Text variant="xs" color="devpurple">
            AppJson version: {appJson().version}
          </Text>
          <Text variant="xs" color="devpurple">
            Build Number: {getBuildNumber()}
          </Text>
          <Text variant="xs" color="devpurple">
            getAppVersion: {getAppVersion()}
          </Text>
        </>
      )}
    </Flex>
  )
}
