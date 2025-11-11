import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import Clipboard from "@react-native-clipboard/clipboard"
import { Expandable } from "app/Components/Expandable"
import { useToast } from "app/Components/Toast/toastHook"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { saveToken } from "app/utils/PushNotification"
import { requestSystemPermissions } from "app/utils/requestPushNotificationsPermission"
import { useEffect, useState } from "react"
import { Platform } from "react-native"

interface PushPayload {
  aps?: {
    alert?: string | { title?: string; body?: string }
  }
  [key: string]: any
}

const getAlertText = (payload: PushPayload): string => {
  const alert = payload.aps?.alert

  if (!alert) {
    return "No alert text"
  }

  if (typeof alert === "string") {
    return alert
  }

  // Handle alert object with title and/or body
  if (typeof alert === "object") {
    const parts: string[] = []
    if (alert.title) parts.push(alert.title)
    if (alert.body) parts.push(alert.body)
    return parts.length > 0 ? parts.join(" - ") : "No alert text"
  }

  return "No alert text"
}

export const PushNotificationOptions: React.FC<{}> = () => {
  const toast = useToast()
  const [pushPayloads, setPushPayloads] = useState<PushPayload[]>([])

  const fetchPushPayloads = async () => {
    const payloads = await LegacyNativeModules.ArtsyNativeModule.getRecentPushPayloads()
    setPushPayloads(payloads || [])
  }

  useEffect(() => {
    fetchPushPayloads()
  }, [])

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
        </Flex>

        <Flex my={2}>
          <Expandable label="Recent Push Payloads" expanded={false}>
            {pushPayloads.length === 0 ? (
              <Flex my={2}>
                <Text variant="xs" color="black60">
                  No recent push payloads
                </Text>
              </Flex>
            ) : (
              pushPayloads.map((payload, index) => {
                const alertText = getAlertText(payload)
                return (
                  <Flex key={index} my={1}>
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Flex flex={1} mr={1}>
                        <Text variant="xs" numberOfLines={2}>
                          {alertText}
                        </Text>
                      </Flex>
                      <Button
                        size="small"
                        variant="outline"
                        onPress={() => {
                          Clipboard.setString(JSON.stringify(payload, null, 2))
                          toast.show("Payload copied to clipboard", "middle")
                        }}
                      >
                        Copy
                      </Button>
                    </Flex>
                    {index < pushPayloads.length - 1 && <Spacer y={0.5} />}
                  </Flex>
                )
              })
            )}
          </Expandable>
        </Flex>
      </Expandable>
    </Flex>
  )
}
