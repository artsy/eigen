import {
  Button,
  ChevronIcon,
  CloseIcon,
  Flex,
  Input,
  Join,
  LogoutIcon,
  Pill,
  ReloadIcon,
  Screen,
  Separator,
  Spacer,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Clipboard from "@react-native-clipboard/clipboard"
import * as Sentry from "@sentry/react-native"
import { Expandable } from "app/Components/Expandable"
import { MenuItem } from "app/Components/MenuItem"
import { SearchInput } from "app/Components/SearchInput"
import { useToast } from "app/Components/Toast/toastHook"
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { GlobalStore } from "app/store/GlobalStore"
import { EnvironmentKey, environment } from "app/store/config/EnvironmentModel"
import {
  DevToggleName,
  FeatureDescriptor,
  FeatureName,
  devToggles,
  features,
} from "app/store/config/features"
import { Versions } from "app/store/migration"
import { CodePushOptions } from "app/system/devTools/DevMenu/CodePushOptions"
import { eigenSentryReleaseName } from "app/system/errorReporting//sentrySetup"
import { dismissModal, goBack, navigate } from "app/system/navigation/navigate"
import { RelayCache } from "app/system/relay/RelayCache"
import { useUnleashEnvironment } from "app/utils/experiments/hooks"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { capitalize, compact, sortBy } from "lodash"
import { useState } from "react"
import {
  Alert,
  AlertButton,
  DevSettings,
  NativeModules,
  Platform,
  Button as RNButton,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native"
import Config from "react-native-config"
import DeviceInfo from "react-native-device-info"
import FastImage from "react-native-fast-image"
import Keychain from "react-native-keychain"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const configurableFeatureFlagKeys = Object.entries(features as { [key: string]: FeatureDescriptor })
  .filter(([_, { showInDevMenu }]) => showInDevMenu)
  .map(([k]) => k as FeatureName)

const configurableDevToggleKeys = sortBy(
  Object.entries(devToggles),
  ([k, { description }]) => description ?? k
).map(([k]) => k as DevToggleName)

export const DevMenu = ({ onClose = () => goBack() }: { onClose(): void }) => {
  const [featureFlagQuery, setFeatureFlagQuery] = useState("")
  const [devToolQuery, setDevToolQuery] = useState("")
  const [url, setUrl] = useState("")

  const [isFeatureFlagOrderReversed, setIsFeatureFlagOrderReversed] = useState(true)

  const toggleFeatureFlagDirection = () => {
    setIsFeatureFlagOrderReversed(!isFeatureFlagOrderReversed)
  }

  const migrationVersion = GlobalStore.useAppState((s) => s.version)
  const server = GlobalStore.useAppState((s) => s.devicePrefs.environment.strings.webURL).slice(
    "https://".length
  )
  const userEmail = GlobalStore.useAppState((s) => s.auth.userEmail)
  const { __clearDissmissed } = GlobalStore.actions.progressiveOnboarding
  const space = useSpace()
  const toast = useToast()

  const handleBackButton = () => {
    onClose()
    return true
  }

  useBackHandler(handleBackButton)

  const { unleashEnv } = useUnleashEnvironment()

  const { top: topInset } = useSafeAreaInsets()

  const androidTopInset = Platform.OS === "android" ? topInset : 0

  return (
    <Screen>
      <Flex flexDirection="row" justifyContent="space-between" mt={`${androidTopInset}px`}>
        <Text variant="lg-display" pb={2} px={2}>
          Dev Settings
        </Text>
        <Buttons onClose={onClose} />
      </Flex>
      <ScrollView
        style={{ flex: 1, borderRadius: 4, overflow: "hidden" }}
        contentContainerStyle={{ paddingTop: space(1), paddingBottom: 80 }}
      >
        <Text variant="xs" color="grey" mx={2}>
          Build:{" "}
          <Text variant="xs">
            v{DeviceInfo.getVersion()}, build {DeviceInfo.getBuildNumber()} (
            {ArtsyNativeModule.gitCommitShortHash})
          </Text>
        </Text>
        <Text variant="xs" color="grey" mx={2}>
          Email: <Text variant="xs">{userEmail}</Text>
        </Text>

        <DevMenuButtonItem
          title="Open RN Dev Menu"
          onPress={() => NativeModules?.DevMenu?.show()}
        />
        <Flex mx={2} mt={2}>
          <Expandable label="Navigate to" expanded={false}>
            <Spacer y={1} />
            <Flex flexDirection="row">
              <Input
                placeholder="Url to navigate to"
                onChangeText={(text) => setUrl(text)}
                autoCapitalize="none"
                returnKeyType="go"
              />
              <Spacer x={1} />
              <Button
                onPress={() => {
                  if (!url) {
                    return
                  }

                  dismissModal(() => navigate(url))
                }}
              >
                Go
              </Button>
            </Flex>
          </Expandable>
        </Flex>
        <Flex mx={2}>
          <Separator my="1" borderColor="black" />
        </Flex>

        <Flex mb={1}>
          <EnvironmentOptions onClose={onClose} />
        </Flex>

        <Flex mx={2} mb={1}>
          <CodePushOptions />
        </Flex>

        <Flex mx={2}>
          <Expandable label="Feature Flags" expanded={false}>
            <Spacer y={1} />
            <Flex mb={1} flexDirection="row" flex={1}>
              <Flex flex={8}>
                <SearchInput
                  onChangeText={setFeatureFlagQuery}
                  placeholder="Search feature flags"
                />
              </Flex>
              <Flex flex={3} justifyContent="center" pr={2}>
                <Pill onPress={toggleFeatureFlagDirection}>
                  {isFeatureFlagOrderReversed ? "Sort ↓" : "Sort ↑"}
                </Pill>
              </Flex>
            </Flex>
            <Flex mx={-2}>
              {isFeatureFlagOrderReversed
                ? configurableFeatureFlagKeys
                    .filter(
                      (flagKey) =>
                        features[flagKey].description
                          ?.toLowerCase()
                          .includes(featureFlagQuery.toLowerCase())
                    )
                    .map((flagKey) => {
                      return <FeatureFlagItem key={flagKey} flagKey={flagKey} />
                    })
                : configurableFeatureFlagKeys
                    .filter(
                      (flagKey) =>
                        features[flagKey].description
                          ?.toLowerCase()
                          .includes(featureFlagQuery.toLowerCase())
                    )
                    .reverse()
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
            </Flex>
          </Expandable>
          <Spacer y={1} />
        </Flex>

        <Flex mx={2}>
          <Expandable label="Dev tools" expanded={false}>
            <Flex my={1}>
              <SearchInput onChangeText={setDevToolQuery} placeholder="Search dev tools" />
            </Flex>

            <Flex mx={-2}>
              {configurableDevToggleKeys
                .filter(
                  (flagKey) =>
                    devToggles[flagKey].description
                      ?.toLowerCase()
                      .includes(devToolQuery.toLowerCase())
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
                  Promise.all([FastImage.clearMemoryCache(), FastImage.clearDiskCache()]).then(
                    () => {
                      toast.show("FastImage cache cleared ✅", "middle")
                    }
                  )
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
                title="Log out"
                titleColor="red100"
                onPress={() => {
                  GlobalStore.actions.auth.signOut()
                }}
              />
            </Flex>
          </Expandable>
        </Flex>
      </ScrollView>
    </Screen>
  )
}

const Buttons: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const isLoggedIn = !!GlobalStore.useAppState((state) => !!state.auth.userID)

  return (
    <Flex style={{ flexDirection: "row", alignItems: "center" }} pb={2} px={2}>
      <Join separator={<Spacer x={2} />}>
        {!!isLoggedIn && (
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Log out", undefined, [
                {
                  text: "Log out",
                  onPress() {
                    GlobalStore.actions.auth.signOut()
                  },
                },
                {
                  text: "Cancel",
                  style: "destructive",
                },
              ])
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <LogoutIcon fill="red100" width={24} height={24} />
          </TouchableOpacity>
        )}

        {!!__DEV__ && (
          <TouchableOpacity
            onPress={() => {
              RelayCache.clearAll()
              onClose()
              requestAnimationFrame(() => DevSettings.reload())
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ReloadIcon width={20} height={20} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CloseIcon width={24} height={24} />
        </TouchableOpacity>
      </Join>
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
        Alert.alert(description as string, undefined, [
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
        RelayCache.clearAll()
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
    <Touchable onPress={onPress} underlayColor={color("black30")} disabled={disabled}>
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
