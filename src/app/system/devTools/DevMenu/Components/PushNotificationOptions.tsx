import { Flex } from "@artsy/palette-mobile"
import Clipboard from "@react-native-clipboard/clipboard"
import { Expandable } from "app/Components/Expandable"
import { useToast } from "app/Components/Toast/toastHook"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { saveToken } from "app/utils/PushNotification"
import { requestSystemPermissions } from "app/utils/requestPushNotificationsPermission"
import { Platform } from "react-native"

export const PushNotificationOptions: React.FC<{}> = () => {
  const toast = useToast()

  return (
    <Flex mx={2}>
      <Expandable label="Push Notifications" expanded={false}>
        <Flex mx={-2}>
          <DevMenuButtonItem
            title="Request push registration"
            onPress={async () => {
              const status = await requestSystemPermissions()
              toast.show(`Push registration status: ${status}`, "middle")

              // On android onRegister is not called when permissions are already granted, make sure token is saved in this env
              if (Platform.OS === "android" && status === "granted") {
                const token = await LegacyNativeModules.ArtsyNativeModule.getPushToken()
                if (token) {
                  saveToken(token)
                }
              }
            }}
          />
          <DevMenuButtonItem
            title="Copy push token"
            onPress={async () => {
              const pushToken = await LegacyNativeModules.ArtsyNativeModule.getPushToken()
              Clipboard.setString(pushToken ?? "")
              if (!pushToken) {
                toast.show("No push token found", "middle")
                return
              }
              toast.show("Copied to clipboard", "middle")
            }}
          />
          <DevMenuButtonItem
            title="Trigger push payloads"
            onPress={async () => {
              const pushPayloads =
                await LegacyNativeModules.ArtsyNativeModule.getRecentPushPayloads()
              console.log("Got recent push payloads", pushPayloads)
            }}
          />
        </Flex>
      </Expandable>
    </Flex>
  )
}
