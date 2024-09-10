import { Flex, SearchInput, MenuItem, Text } from "@artsy/palette-mobile"
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
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { RelayCache } from "app/system/relay/RelayCache"
import { useUnleashEnvironment } from "app/utils/experiments/hooks"
import { capitalize, sortBy } from "lodash"
import { useState } from "react"
import { Alert, Button, Platform } from "react-native"
import Config from "react-native-config"
import DeviceInfo from "react-native-device-info"
import FastImage from "react-native-fast-image"
import Keychain from "react-native-keychain"

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
              Keychain.resetInternetCredentials(server)
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
            title="Clear Relay Cache"
            onPress={() => {
              RelayCache.clearAll().then(() => {
                toast.show("Relay cache cleared ✅", "middle")
              })
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
            title="Clear Progressive Onboarding progress"
            onPress={__clearDissmissed}
          />
          <DevMenuButtonItem title={`Active Unleash env: ${capitalize(unleashEnv)}`} />

          <DevMenuButtonItem
            title="Throw Sentry Error"
            onPress={() => {
              if (!Config.SENTRY_DSN) {
                Alert.alert(
                  "No Sentry DSN available",
                  __DEV__ ? "Set it in .env.shared and re-build the app." : undefined
                )
                return
              }
              throw Error("Sentry test error")
            }}
          />
          <DevMenuButtonItem
            title="Trigger Sentry Native Crash"
            onPress={() => {
              if (!Config.SENTRY_DSN) {
                Alert.alert(
                  "No Sentry DSN available",
                  __DEV__ ? "Set it in .env.shared and re-build the app." : undefined
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
            title="Copy push token"
            onPress={async () => {
              let pushToken
              if (Platform.OS === "ios") {
                pushToken = await LegacyNativeModules.ArtsyNativeModule.getPushToken()
              } else {
                pushToken = await AsyncStorage.getItem("PUSH_NOTIFICATION_TOKEN")
              }
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
