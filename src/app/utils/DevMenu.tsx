import {
  Spacer,
  CloseIcon,
  ChevronIcon,
  ReloadIcon,
  Flex,
  useColor,
  Text,
  useSpace,
  Separator,
  Touchable,
} from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Clipboard from "@react-native-clipboard/clipboard"
import * as Sentry from "@sentry/react-native"
import { CollapseMenu } from "app/Components/CollapseMenu"
import { MenuItem } from "app/Components/MenuItem"
import { SearchInput } from "app/Components/SearchInput"
import { useToast } from "app/Components/Toast/toastHook"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { GlobalStore } from "app/store/GlobalStore"
import { environment, EnvironmentKey } from "app/store/config/EnvironmentModel"
import { DevToggleName, devToggles, FeatureName, features } from "app/store/config/features"
import { Versions } from "app/store/migration"
import { eigenSentryReleaseName } from "app/system/errorReporting//sentrySetup"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { RelayCache } from "app/system/relay/RelayCache"
import { capitalize, compact, sortBy } from "lodash"
import { useCallback, useEffect, useState } from "react"
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
import DeviceInfo from "react-native-device-info"
import Keychain from "react-native-keychain"
import { useUnleashEnvironment } from "./experiments/hooks"

const configurableFeatureFlagKeys = Object.entries(features)
  .filter(([_, { showInDevMenu }]) => showInDevMenu)
  .map(([k]) => k as FeatureName)

const configurableDevToggleKeys = sortBy(
  Object.entries(devToggles),
  ([k, { description }]) => description ?? k
).map(([k]) => k as DevToggleName)

export const DevMenu = ({ onClose = () => dismissModal() }: { onClose(): void }) => {
  const [featureFlagQuery, setFeatureFlagQuery] = useState("")
  const [devToolQuery, setDevToolQuery] = useState("")
  const migrationVersion = GlobalStore.useAppState((s) => s.version)
  const server = GlobalStore.useAppState((s) => s.devicePrefs.environment.strings.webURL).slice(
    "https://".length
  )
  const userEmail = GlobalStore.useAppState((s) => s.auth.userEmail)
  const space = useSpace()
  const toast = useToast()

  useEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton)

      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButton)
    }, [])
  )
  const handleBackButton = () => {
    onClose()
    return true
  }
  const { unleashEnv } = useUnleashEnvironment()

  const chevronStyle = { marginRight: space(1) }

  return (
    <Flex position="absolute" top={0} left={0} right={0} bottom={0} py={2}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="lg-display" pb={2} px={2}>
          Dev Settings
        </Text>
        <Buttons onClose={onClose} />
      </Flex>

      <ScrollView
        style={{ flex: 1, borderRadius: 4, overflow: "hidden" }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <Text variant="xs" color="grey" mx={2}>
          eigen v{DeviceInfo.getVersion()}, build {DeviceInfo.getBuildNumber()} (
          {ArtsyNativeModule.gitCommitShortHash})
        </Text>
        <Text variant="xs" color="grey" mx={2}>
          {userEmail}
        </Text>
        <DevMenuButtonItem title="Open RN Dev Menu" onPress={() => NativeModules.DevMenu.show()} />

        <DevMenuButtonItem
          title="Go to Storybook"
          onPress={() => {
            navigate("/storybook")
          }}
        />
        <DevMenuButtonItem
          title="Navigate to..."
          onPress={() =>
            Alert.prompt("Navigate to...", "Where should we navigate to?", [
              {
                text: "Go",
                onPress: (url) => {
                  if (!url) {
                    return
                  }

                  dismissModal(() => navigate(url))
                },
              },
            ])
          }
        />
        <Flex mx={2}>
          <Separator my="1" />
        </Flex>

        <EnvironmentOptions onClose={onClose} />

        <Flex mx={2}>
          <Separator my="1" />
        </Flex>

        <CollapseMenu title="Feature Flags" chevronStyle={chevronStyle}>
          <Flex px={2} mb={1}>
            <SearchInput onChangeText={setFeatureFlagQuery} placeholder="Search feature flags" />
          </Flex>
          {configurableFeatureFlagKeys
            .filter((flagKey) =>
              features[flagKey].description?.toLowerCase().includes(featureFlagQuery.toLowerCase())
            )
            .map((flagKey) => {
              return <FeatureFlagItem key={flagKey} flagKey={flagKey} />
            })}
          <DevMenuButtonItem
            title="Revert all feature flags to default"
            titleColor="red100"
            onPress={() => {
              GlobalStore.actions.artsyPrefs.features.clearLocalOverrides()
            }}
          />
        </CollapseMenu>

        <Flex mx={2}>
          <Separator my="1" />
        </Flex>
        <CollapseMenu title="Dev tools" chevronStyle={chevronStyle}>
          <Flex px={2} mb={1}>
            <SearchInput onChangeText={setDevToolQuery} placeholder="Search dev tools" />
          </Flex>

          {configurableDevToggleKeys
            .filter((flagKey) =>
              devToggles[flagKey].description?.toLowerCase().includes(devToolQuery.toLowerCase())
            )
            .map((devToggleKey) => {
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
          <DevMenuButtonItem
            title="Open Art Quiz"
            onPress={() => {
              dismissModal(() => navigate("/art-quiz"))
            }}
          />
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
              AsyncStorage.clear()
            }}
          />
          <DevMenuButtonItem
            title="Clear Relay Cache"
            onPress={() => {
              RelayCache.clearAll()
            }}
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
          {Platform.OS === "ios" && (
            <DevMenuButtonItem
              title="Go to old Dev Menu"
              onPress={() => {
                navigate("/dev-menu-old", { modal: true })
              }}
            />
          )}

          <DevMenuButtonItem
            title="Log out"
            titleColor="red100"
            onPress={() => {
              GlobalStore.actions.auth.signOut()
            }}
          />
        </CollapseMenu>
      </ScrollView>
    </Flex>
  )
}

const Buttons: React.FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <Flex style={{ flexDirection: "row", alignItems: "center" }} pb={2} px={2}>
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
          <Spacer x={2} />
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
  const isLocalOverrideInEffect = flagKey in config.features.localOverrides
  const valText = currentValue ? "Yes" : "No"
  const description = features[flagKey].description ?? flagKey

  return (
    <DevMenuButtonItem
      title={description}
      onPress={() => {
        Alert.alert(description, undefined, [
          {
            text: "Override with 'Yes'",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: flagKey,
                value: true,
              })
            },
          },
          {
            text: "Override with 'No'",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: flagKey,
                value: false,
              })
            },
          },
          {
            text: isLocalOverrideInEffect ? "Revert to default value" : "Keep default value",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: flagKey,
                value: null,
              })
            },
            style: "destructive",
          },
        ])
      }}
      value={
        isLocalOverrideInEffect ? (
          <Text variant="sm-display" color="black100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="sm-display" color="black60">
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
    <DevMenuButtonItem
      title={description}
      onPress={() => {
        Alert.alert(description, undefined, [
          {
            text: currentValue ? "Keep turned ON" : "Turn ON",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
                key: toggleKey,
                value: true,
              })
              devToggles[toggleKey].onChange?.(true, { toast })
            },
          },
          {
            text: currentValue ? "Turn OFF" : "Keep turned OFF",
            onPress() {
              GlobalStore.actions.artsyPrefs.features.setLocalOverride({
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
          <Text variant="sm-display" color="black100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="sm-display" color="black60">
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
    if (!ArtsyNativeModule.isBetaOrDev) {
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
      GlobalStore.actions.devicePrefs.environment.clearLocalOverrides()
      if (env !== currentEnv) {
        GlobalStore.actions.devicePrefs.environment.setEnv(env)
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
  const { env, localOverrides, strings } = GlobalStore.useAppState(
    (store) => store.devicePrefs.environment
  )
  // show custom url options if there are already local overrides in effect, or if the user has tapped the option
  // to set custom overrides during the lifetime of this component
  const [showCustomURLOptions, setShowCustomURLOptions] = useState(
    Object.keys(localOverrides).length > 0
  )

  return (
    <>
      <DevMenuButtonItem
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
                      GlobalStore.actions.devicePrefs.environment.setLocalOverride({
                        key: key as EnvironmentKey,
                        value,
                      })
                    },
                  }))
                )
              }}
            >
              <Flex
                ml={2}
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
                    <Text variant="sm-display">{strings[key as EnvironmentKey]}</Text>
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

export const DevMenuButtonItem: React.FC<{
  disabled?: boolean
  onPress?: () => void
  title: React.ReactNode
  titleColor?: string
  value?: React.ReactNode
}> = ({ disabled = false, onPress, title, titleColor = "black100", value }) => {
  const color = useColor()
  return (
    <Touchable onPress={onPress} underlayColor={color("black5")} disabled={disabled}>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        py="7.5px"
        px={2}
        pr="15px"
      >
        <Flex flexDirection="row" mr={2} flex={5}>
          <Text variant="sm-display" color={titleColor}>
            {title}
          </Text>
        </Flex>
        {!!value && (
          <Flex flex={3} flexDirection="row" alignItems="center">
            <Flex flex={3}>
              <Text variant="sm-display" color="black60" numberOfLines={1} textAlign="right">
                {value}
              </Text>
            </Flex>
            <Flex ml={1} flex={1}>
              <ChevronIcon direction="right" fill="black60" />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Touchable>
  )
}
