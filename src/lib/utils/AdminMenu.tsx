import AsyncStorage from "@react-native-community/async-storage"
import { MenuItem } from "lib/Components/MenuItem"
import { dismissModal, navigate } from "lib/navigation/navigate"
import { environment, EnvironmentKey } from "lib/store/config/EnvironmentModel"
import { FeatureName, features } from "lib/store/config/features"
import { GlobalStore } from "lib/store/GlobalStore"
import { capitalize, sortBy } from "lodash"
import { ChevronIcon, CloseIcon, color, Flex, ReloadIcon, Separator, Spacer, Text } from "palette"
import React, { useState } from "react"
import {
  Alert,
  AlertButton,
  DevSettings,
  Platform,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native"
import Config from "react-native-config"
import { useScreenDimensions } from "./useScreenDimensions"

const configurableFeatureFlagKeys = sortBy(
  Object.entries(features).filter(([_, { showInAdminMenu }]) => showInAdminMenu),
  ([k, { description }]) => description ?? k
).map(([k]) => k as FeatureName)

export const AdminMenu: React.FC<{ onClose(): void }> = ({ onClose = dismissModal }) => {
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
      <Text variant="largeTitle" pb="2" px="2">
        Admin Settings
      </Text>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white", borderRadius: 4, overflow: "hidden" }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {Platform.OS === "ios" && (
          <>
            <MenuItem
              title="Go to old Admin menu"
              onPress={() => {
                navigate("/admin", { modal: true })
              }}
            />
            <Flex mx="2">
              <Separator my="1" />
            </Flex>
          </>
        )}
        <EnvironmentOptions></EnvironmentOptions>

        <Flex mx="2">
          <Separator my="1" />
        </Flex>

        <Text variant="title" my="1" mx="2">
          Feature Flags
        </Text>
        {configurableFeatureFlagKeys.map((flagKey) => {
          return <FeatureFlagItem key={flagKey} flagKey={flagKey} />
        })}
        <Flex mx="2">
          <Separator my="1" />
        </Flex>
        <Text variant="title" my="1" mx="2">
          Tools
        </Text>
        <MenuItem
          title="Clear AsyncStorage"
          chevron={null}
          onPress={() => {
            AsyncStorage.clear()
          }}
        />
        <MenuItem
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
          chevron={null}
        />
      </ScrollView>
      <Buttons onClose={onClose} />
    </Flex>
  )
}

const Buttons: React.FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <View style={{ position: "absolute", top: 29, right: 20, flexDirection: "row", alignItems: "center" }}>
      {!!__DEV__ && (
        <>
          <TouchableOpacity
            onPress={() => {
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
    </View>
  )
}

const FeatureFlagItem: React.FC<{ flagKey: FeatureName }> = ({ flagKey }) => {
  const config = GlobalStore.useAppState((s) => s.config)
  const currentValue = config.features.flags[flagKey]
  const isAdminOverrideInEffect = flagKey in config.features.adminFeatureFlagOverrides
  const valText = currentValue ? "Yes" : "No"
  return (
    <MenuItem
      title={features[flagKey].description ?? flagKey}
      onPress={() => {
        Alert.alert(features[flagKey].description ?? flagKey, undefined, [
          {
            text: "Override with 'Yes'",
            onPress() {
              GlobalStore.actions.config.features.setAdminOverride({ key: flagKey, value: true })
            },
          },
          {
            text: "Override with 'No'",
            onPress() {
              GlobalStore.actions.config.features.setAdminOverride({ key: flagKey, value: false })
            },
          },
          {
            text: isAdminOverrideInEffect ? "Revert to default value" : "Keep default value",
            onPress() {
              GlobalStore.actions.config.features.setAdminOverride({ key: flagKey, value: null })
            },
            style: "destructive",
          },
        ])
      }}
      value={
        isAdminOverrideInEffect ? (
          <Text variant="subtitle" color="black100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="subtitle" color="black60">
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
  setShowCustomURLOptions: (newValue: boolean) => void
): AlertButton {
  let text = `Log out and switch to '${capitalize(env)}'`
  if (currentEnv === env) {
    if (showCustomURLOptions) {
      text = `Reset all to '${capitalize(env)}'`
    } else {
      text = `Customize '${capitalize(env)}'`
    }
  }
  return {
    text,
    onPress() {
      GlobalStore.actions.config.environment.clearAdminOverrides()
      if (env !== currentEnv) {
        GlobalStore.actions.config.environment.setEnv(env)
        if (Platform.OS === "ios") {
          dismissModal()
        }
        GlobalStore.actions.signOut()
      } else {
        setShowCustomURLOptions(!showCustomURLOptions)
      }
    },
  }
}

const EnvironmentOptions: React.FC<{}> = ({}) => {
  const { env, adminOverrides, strings } = GlobalStore.useAppState((store) => store.config.environment)
  // show custom url options if there are already admin overrides in effect, or if the user has tapped the option
  // to set custom overrides during the lifetime of this component
  const [showCustomURLOptions, setShowCustomURLOptions] = useState(Object.keys(adminOverrides).length > 0)
  return (
    <>
      <MenuItem
        title="Environment"
        value={showCustomURLOptions ? `Custom (${capitalize(env)})` : capitalize(env)}
        onPress={() => {
          Alert.alert(
            "Environment",
            undefined,
            [
              envMenuOption("staging", env, showCustomURLOptions, setShowCustomURLOptions),
              envMenuOption("production", env, showCustomURLOptions, setShowCustomURLOptions),
              {
                text: "Cancel",
                style: "destructive",
              },
            ],
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
                      GlobalStore.actions.config.environment.setAdminOverride({ key: key as EnvironmentKey, value })
                    },
                  }))
                )
              }}
            >
              <Flex ml="2" mr="15px" my="5px" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Flex>
                  <Text variant="caption" color="black60" mb="0.5">
                    {description}
                  </Text>
                  <Flex key={key} flexDirection="row" justifyContent="space-between">
                    <Text variant="caption">{strings[key as EnvironmentKey]}</Text>
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
