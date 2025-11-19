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
  _receivedAt?: string
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

const formatTimestamp = (timestamp?: string): string | null => {
  if (!timestamp) return null

  try {
    // Format: "2025-11-11 13:46:47 +0000"
    const date = new Date(timestamp.replace(" +0000", "Z"))
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    // Fallback to formatted date
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return null
  }
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
          <Expandable label="🔔 Recent Push Payloads" expanded={false}>
            {!pushPayloads || pushPayloads.length === 0 ? (
              <Flex my={2}>
                <Text variant="xs" color="black60">
                  No recent push payloads
                </Text>
              </Flex>
            ) : (
              pushPayloads.map((payload, index) => {
                const alertText = getAlertText(payload)
                const timestamp = formatTimestamp(payload._receivedAt)
                return (
                  <Flex key={index} my={1}>
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Flex flex={1} mr={1}>
                        <Text variant="xs" numberOfLines={2}>
                          {alertText}
                        </Text>
                        {!!timestamp && (
                          <Text variant="xs" color="mono60">
                            {timestamp}
                          </Text>
                        )}
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
