import { Flex, MenuItem, SearchInput, Text } from "@artsy/palette-mobile"
import FastImage from "@d11/react-native-fast-image"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Clipboard from "@react-native-clipboard/clipboard"
import * as Sentry from "@sentry/react-native"
import { Expandable } from "app/Components/Expandable"
import { useToast } from "app/Components/Toast/toastHook"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { GlobalStore } from "app/store/GlobalStore"
import { DevToggleName, devToggles } from "app/store/config/features"
import { Versions } from "app/store/migration"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { DevToggleItem } from "app/system/devTools/DevMenu/Components/DevToggleItem"
import { eigenSentryReleaseName } from "app/system/errorReporting/setupSentry"
import { useUnleashEnvironment } from "app/system/flags/hooks/useUnleashEnvironment"
// eslint-disable-next-line no-restricted-imports
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { _globalCacheRef } from "app/system/relay/defaultEnvironment"
import { saveToken } from "app/utils/PushNotification"
import { _removeVisualClueAsSeen } from "app/utils/hooks/useVisualClue"
import { requestSystemPermissions } from "app/utils/requestPushNotificationsPermission"
import { capitalize, sortBy } from "lodash"
import { useState } from "react"
import { Alert, Button, Platform } from "react-native"
import DeviceInfo from "react-native-device-info"
import Keychain from "react-native-keychain"
import Keys from "react-native-keys"

const configurableDevToggleKeys = sortBy(
  Object.entries(devToggles),
  ([k, { description }]) => description ?? k
).map(([k]) => k as DevToggleName)

export const DevTools: React.FC<{}> = () => {
  const [devToolQuery, setDevToolQuery] = useState("")
  const migrationVersion = GlobalStore.useAppState((s) => s.version)
  const server = GlobalStore.useAppState((s) => s.devicePrefs.environment.strings.webURL).slice(
    "https://".length
  )
  const { __clearDissmissed } = GlobalStore.actions.progressiveOnboarding
  const toast = useToast()

  const { unleashEnv } = useUnleashEnvironment()

  return (
    <Flex mx={2}>
      <Expandable label="Dev tools" expanded={false}>
        <Flex my={1}>
          <SearchInput onChangeText={setDevToolQuery} placeholder="Search dev tools" />
        </Flex>

        <Flex mx={-2}>
          {configurableDevToggleKeys
            .filter(
              (flagKey) =>
                devToggles[flagKey].description?.toLowerCase().includes(devToolQuery.toLowerCase())
            )
            .map((devToggleKey) => {
              return <DevToggleItem key={devToggleKey} toggleKey={devToggleKey} />
            })}

          <DevMenuButtonItem
            title="Open Art Quiz"
            onPress={() => {
              dismissModal(() => navigate("/art-quiz"))
            }}
          />
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Flex>
              <MenuItem title="Migration version" />
            </Flex>
            <Flex flexDirection="row" alignItems="center" pr={2}>
              <Button
                title="-"
                onPress={() => GlobalStore.actions._setVersion(migrationVersion - 1)}
              />
              <Text>{migrationVersion}</Text>
              <Button
                title="+"
                onPress={() => GlobalStore.actions._setVersion(migrationVersion + 1)}
              />
            </Flex>
          </Flex>
          <DevMenuButtonItem
            title={`Migration name: "${
              (Object.entries(Versions).find(([_, v]) => v === migrationVersion) ?? ["N/A"])[0]
            }"`}
            disabled
          />
          <DevMenuButtonItem
            title="Clear Keychain"
            onPress={() => {
              Keychain.resetInternetCredentials({ server }).then(() => {
                toast.show("Keychain cleared ✅", "middle")
              })
            }}
          />

          <DevMenuButtonItem
            title="Clear AsyncStorage"
            onPress={() => {
              AsyncStorage.clear().then(() => {
                toast.show("AsyncStorage cleared ✅", "middle")
              })
            }}
          />
          <DevMenuButtonItem
            title="Clear Visual Clues"
            onPress={() => {
              _removeVisualClueAsSeen("all")
            }}
          />
          <DevMenuButtonItem
            title="Clear Relay Cache"
            onPress={() => {
              _globalCacheRef?.clear()
              toast.show("Relay cache cleared ✅", "middle")
            }}
          />
          <DevMenuButtonItem
            title="Clear FastImage Cache"
            onPress={() => {
              Promise.all([FastImage.clearMemoryCache(), FastImage.clearDiskCache()]).then(() => {
                toast.show("FastImage cache cleared ✅", "middle")
              })
            }}
          />
          <DevMenuButtonItem
            title="Set Onboarding state to incomplete"
            onPress={() => {
              GlobalStore.actions.onboarding.setOnboardingState("incomplete")
            }}
          />
          <DevMenuButtonItem
            title="Clear Progressive Onboarding progress"
            onPress={() => {
              __clearDissmissed()
              toast.show("Progressive Onboarding progress cleared ✅", "middle")
            }}
          />
          <DevMenuButtonItem
            title="Reset infinite discovery onboarding progress"
            onPress={() => {
              GlobalStore.actions.infiniteDiscovery.setHasInteractedWithOnboarding(false)
              toast.show(
                "Infinite discovery onboarding progress reset. It will now appear again when you open the infinite discovery.",
                "middle"
              )
            }}
          />

          <DevMenuButtonItem title={`Active Unleash env: ${capitalize(unleashEnv)}`} />

          <DevMenuButtonItem
            title="Throw Sentry Error"
            onPress={() => {
              if (!Keys.secureFor("SENTRY_DSN")) {
                Alert.alert(
                  "No Sentry DSN available",
                  __DEV__ ? "Set it in keys.shared.json and re-build the app." : undefined
                )
                return
              }
              throw Error("Sentry test error")
            }}
          />
          <DevMenuButtonItem
            title="Trigger Sentry Native Crash"
            onPress={() => {
              if (!Keys.secureFor("SENTRY_DSN")) {
                Alert.alert(
                  "No Sentry DSN available",
                  __DEV__ ? "Set it in keys.shared.json and re-build the app." : undefined
                )
                return
              }
              Sentry.nativeCrash()
            }}
          />
          <DevMenuButtonItem title={`Sentry release name: "${eigenSentryReleaseName()}"`} />
          <DevMenuButtonItem
            title={`Device ID: ${DeviceInfo.getUniqueIdSync()}`}
            onPress={() => {
              Clipboard.setString(DeviceInfo.getUniqueIdSync())
              toast.show("Copied to clipboard", "middle")
            }}
          />
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
            title="Log out"
            titleColor="red100"
            onPress={() => {
              GlobalStore.actions.auth.signOut()
            }}
          />
        </Flex>
      </Expandable>
    </Flex>
  )
}
