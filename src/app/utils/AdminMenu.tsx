import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Sentry from "@sentry/react-native"
import { MenuItem } from "app/Components/MenuItem"
import { useToast } from "app/Components/Toast/toastHook"
import { eigenSentryReleaseName } from "app/errorReporting/sentrySetup"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { dismissModal, navigate } from "app/navigation/navigate"
import { RelayCache } from "app/relay/RelayCache"
import { environment, EnvironmentKey } from "app/store/config/EnvironmentModel"
import { DevToggleName, devToggles, FeatureName, features } from "app/store/config/features"
import { GlobalStore } from "app/store/GlobalStore"
import { Versions } from "app/store/migration"
import { capitalize, compact, sortBy } from "lodash"
import {
  ChevronIcon,
  CloseIcon,
  Flex,
  ReloadIcon,
  Sans,
  Separator,
  Spacer,
  Text,
  Touchable,
  useColor,
} from "palette"
import React, { useEffect, useState } from "react"
import {
  Alert,
  AlertButton,
  BackHandler,
  Button as RNButton,
  DevSettings,
  NativeModules,
  Platform,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native"
import Config from "react-native-config"
import { getBuildNumber, getUniqueId, getVersion } from "react-native-device-info"
import Keychain from "react-native-keychain"
import { useUnleashEnvironment } from "./experiments/hooks"
import { useScreenDimensions } from "./useScreenDimensions"

const configurableFeatureFlagKeys = Object.entries(features)
  .filter(([_, { showInAdminMenu }]) => showInAdminMenu)
  .map(([k]) => k as FeatureName)

const configurableDevToggleKeys = sortBy(
  Object.entries(devToggles),
  ([k, { description }]) => description ?? k
).map(([k]) => k as DevToggleName)

export const AdminMenu: React.FC<{ onClose(): void }> = ({ onClose = dismissModal }) => {
  const migrationVersion = GlobalStore.useAppState((s) => s.version)
  const server = GlobalStore.useAppState((s) => s.artsyPrefs.environment.strings.webURL).slice(
    "https://".length
  )

  useEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton)

      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButton)
    }, [])
  )
  const handleBackButton = () => {
    onClose()
    return true
  }
  const { unleashEnv } = useUnleashEnvironment()

  return (
    <Flex
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
      }}
      pb="2"
      pt={useScreenDimensions().safeAreaInsets.top + 20}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="lg" pb="2" px="2">
          Admin Settings
        </Text>
        <Buttons onClose={onClose} />
      </Flex>

      <ScrollView
        style={{ flex: 1, backgroundColor: "white", borderRadius: 4, overflow: "hidden" }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <Text variant="xs" color="grey" mx="2">
          eigen v{getVersion()}, build {getBuildNumber()} ({ArtsyNativeModule.gitCommitShortHash})
        </Text>
        {Platform.OS === "ios" && (
          <FeatureFlagMenuItem
            title="Go to old Admin menu"
            onPress={() => {
              navigate("/admin", { modal: true })
            }}
          />
        )}
        {/* <FeatureFlagMenuItem
          title="Go to Storybook"
          onPress={() => {
            navigate("/storybook")
          }}
        /> */}
        <Flex mx="2">
          <Separator my="1" />
        </Flex>

        <EnvironmentOptions onClose={onClose} />

        <Flex mx="2">
          <Separator my="1" />
        </Flex>

        <Text variant="md" my="1" mx="2">
          Feature Flags
        </Text>
        {configurableFeatureFlagKeys.map((flagKey) => {
          return <FeatureFlagItem key={flagKey} flagKey={flagKey} />
        })}
        <FeatureFlagMenuItem
          title="Revert all feature flags to default"
          onPress={() => {
            GlobalStore.actions.artsyPrefs.features.clearAdminOverrides()
          }}
        />
        <Flex mx="2">
          <Separator my="1" />
        </Flex>
        <Text variant="md" my="1" mx="2">
          Tools
        </Text>
        {configurableDevToggleKeys.map((devToggleKey) => {
          return <DevToggleItem key={devToggleKey} toggleKey={devToggleKey} />
        })}
        <MenuItem
          title="Migration version"
          rightView={
            <Flex flexDirection="row" alignItems="center">
              <RNButton
                title="-"
                onPress={() => GlobalStore.actions._setVersion(migrationVersion - 1)}
              />
              <Text>{migrationVersion}</Text>
              <RNButton
                title="+"
                onPress={() => GlobalStore.actions._setVersion(migrationVersion + 1)}
              />
            </Flex>
          }
        />
        <FeatureFlagMenuItem
          title={`Migration name: "${
            (Object.entries(Versions).find(([_, v]) => v === migrationVersion) ?? ["N/A"])[0]
          }"`}
          disabled
        />
        <FeatureFlagMenuItem
          title="Clear Keychain"
          onPress={() => {
            Keychain.resetInternetCredentials(server)
          }}
        />
        <FeatureFlagMenuItem
          title="Open RN Dev Menu"
          onPress={() => NativeModules.DevMenu.show()}
        />
        <FeatureFlagMenuItem
          title="Clear AsyncStorage"
          onPress={() => {
            AsyncStorage.clear()
          }}
        />
        <FeatureFlagMenuItem
          title="Clear Relay Cache"
          onPress={() => {
            RelayCache.clearAll()
          }}
        />
        <FeatureFlagMenuItem title={`Active Unleash env: ${capitalize(unleashEnv)}`} />
        <FeatureFlagMenuItem
          title="Log out"
          onPress={() => {
            GlobalStore.actions.auth.signOut()
          }}
        />
        <FeatureFlagMenuItem
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
        <FeatureFlagMenuItem
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
        <FeatureFlagMenuItem title={`Sentry release name: "${eigenSentryReleaseName()}"`} />
        <FeatureFlagMenuItem title={`Device ID: "${getUniqueId()}"`} />
      </ScrollView>
    </Flex>
  )
}

const Buttons: React.FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <Flex style={{ flexDirection: "row", alignItems: "center" }} pb="2" px="2">
      {!!__DEV__ && (
        <>
          <TouchableOpacity
            onPress={() => {
              RelayCache.clearAll()
              onClose()
              requestAnimationFrame(() => DevSettings.reload())
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ReloadIcon width={16} height={16} />
          </TouchableOpacity>
          <Spacer mr="2" />
        </>
      )}

      <TouchableOpacity onPress={onClose} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CloseIcon />
      </TouchableOpacity>
    </Flex>
  )
}

const FeatureFlagItem: React.FC<{ flagKey: FeatureName }> = ({ flagKey }) => {
  const config = GlobalStore.useAppState((s) => s.artsyPrefs)
  const currentValue = config.features.flags[flagKey]
  const isAdminOverrideInEffect = flagKey in config.features.adminOverrides
  const valText = currentValue ? "Yes" : "No"
  const description = features[flagKey].description ?? flagKey

  return (
    <FeatureFlagMenuItem
      title={description}
      onPress={() => {
        Alert.alert(description, undefined, [
          {
            text: "Override with 'Yes'",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setAdminOverride({
                key: flagKey,
                value: true,
              })
            },
          },
          {
            text: "Override with 'No'",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setAdminOverride({
                key: flagKey,
                value: false,
              })
            },
          },
          {
            text: isAdminOverrideInEffect ? "Revert to default value" : "Keep default value",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setAdminOverride({
                key: flagKey,
                value: null,
              })
            },
            style: "destructive",
          },
        ])
      }}
      value={
        isAdminOverrideInEffect ? (
          <Text variant="md" color="black100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="md" color="black60">
            {valText}
          </Text>
        )
      }
    />
  )
}

const DevToggleItem: React.FC<{ toggleKey: DevToggleName }> = ({ toggleKey }) => {
  const config = GlobalStore.useAppState((s) => s.artsyPrefs)
  const currentValue = config.features.devToggles[toggleKey]
  const valText = currentValue ? "Yes" : "No"
  const description = devToggles[toggleKey].description
  const toast = useToast()

  return (
    <FeatureFlagMenuItem
      title={description}
      onPress={() => {
        Alert.alert(description, undefined, [
          {
            text: currentValue ? "Keep turned ON" : "Turn ON",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setAdminOverride({
                key: toggleKey,
                value: true,
              })
              devToggles[toggleKey].onChange?.(true, { toast })
            },
          },
          {
            text: currentValue ? "Turn OFF" : "Keep turned OFF",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setAdminOverride({
                key: toggleKey,
                value: false,
              })
              devToggles[toggleKey].onChange?.(false, { toast })
            },
          },
        ])
      }}
      value={
        currentValue ? (
          <Text variant="md" color="black100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="md" color="black60">
            {valText}
          </Text>
        )
      }
    />
  )
}

function envMenuOption(
  env: "staging" | "production",
  currentEnv: "staging" | "production",
  showCustomURLOptions: boolean,
  setShowCustomURLOptions: (newValue: boolean) => void,
  onClose: () => void
): AlertButton | null {
  let text = `Log out and switch to '${capitalize(env)}'`
  if (currentEnv === env) {
    if (!__DEV__) {
      return null
    }
    if (showCustomURLOptions) {
      text = `Reset all to '${capitalize(env)}'`
    } else {
      text = `Customize '${capitalize(env)}'`
    }
  }
  return {
    text,
    onPress() {
      GlobalStore.actions.artsyPrefs.environment.clearAdminOverrides()
      if (env !== currentEnv) {
        GlobalStore.actions.artsyPrefs.environment.setEnv(env)
        onClose()
        GlobalStore.actions.auth.signOut()
      } else {
        setShowCustomURLOptions(!showCustomURLOptions)
      }
    },
  }
}

const EnvironmentOptions: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const color = useColor()
  const { env, adminOverrides, strings } = GlobalStore.useAppState(
    (store) => store.artsyPrefs.environment
  )
  // show custom url options if there are already admin overrides in effect, or if the user has tapped the option
  // to set custom overrides during the lifetime of this component
  const [showCustomURLOptions, setShowCustomURLOptions] = useState(
    Object.keys(adminOverrides).length > 0
  )
  return (
    <>
      <FeatureFlagMenuItem
        title="Environment"
        value={showCustomURLOptions ? `Custom (${capitalize(env)})` : capitalize(env)}
        onPress={() => {
          Alert.alert(
            "Environment",
            undefined,
            compact([
              envMenuOption("staging", env, showCustomURLOptions, setShowCustomURLOptions, onClose),
              envMenuOption(
                "production",
                env,
                showCustomURLOptions,
                setShowCustomURLOptions,
                onClose
              ),
              {
                text: "Cancel",
                style: "destructive",
              },
            ]),
            { cancelable: true }
          )
        }}
      />
      {!!showCustomURLOptions &&
        Object.entries(environment).map(([key, { description, presets }]) => {
          return (
            <TouchableHighlight
              key={key}
              underlayColor={color("black5")}
              onPress={() => {
                Alert.alert(
                  description,
                  undefined,
                  Object.entries(presets).map(([name, value]) => ({
                    text: name,
                    onPress: () => {
                      GlobalStore.actions.artsyPrefs.environment.setAdminOverride({
                        key: key as EnvironmentKey,
                        value,
                      })
                    },
                  }))
                )
              }}
            >
              <Flex
                ml="2"
                mr="15px"
                my="5px"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Flex>
                  <Text variant="xs" color="black60" mb="0.5">
                    {description}
                  </Text>
                  <Flex key={key} flexDirection="row" justifyContent="space-between">
                    <Text variant="xs">{strings[key as EnvironmentKey]}</Text>
                  </Flex>
                </Flex>
                <ChevronIcon fill="black60" direction="right" />
              </Flex>
            </TouchableHighlight>
          )
        })}
    </>
  )
}

export const FeatureFlagMenuItem: React.FC<{
  disabled?: boolean
  onPress?: () => void
  title: React.ReactNode
  value?: React.ReactNode
}> = ({ disabled = false, onPress, title, value }) => {
  const color = useColor()
  return (
    <Touchable onPress={onPress} underlayColor={color("black5")} disabled={disabled}>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        py={7.5}
        px="2"
        pr="15px"
      >
        <Flex flexDirection="row" mr="2" flex={5}>
          <Sans size="5">{title}</Sans>
        </Flex>
        {!!value && (
          <Flex flex={2} flexDirection="row" alignItems="center">
            <Flex flex={3}>
              <Sans size="5" color="black60" numberOfLines={1} textAlign="right">
                {value}
              </Sans>
            </Flex>
            <Flex ml="1" flex={1}>
              <ChevronIcon direction="right" fill="black60" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Touchable>
  )
}
