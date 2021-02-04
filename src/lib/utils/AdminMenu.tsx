import AsyncStorage from "@react-native-community/async-storage"
import { MenuItem } from "lib/Components/MenuItem"
import { dismissModal, navigate } from "lib/navigation/navigate"
import { FeatureName, features } from "lib/store/features"
import { getCurrentEmissionState, GlobalStore } from "lib/store/GlobalStore"
import { sortBy } from "lodash"
import { CloseIcon, Flex, ReloadIcon, Separator, Spacer, Text } from "palette"
import React from "react"
import { Alert, DevSettings, Platform, ScrollView, TouchableOpacity, View } from "react-native"
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
            if (!getCurrentEmissionState().sentryDSN) {
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
      <TouchableOpacity onPress={onClose} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CloseIcon />
      </TouchableOpacity>
    </View>
  )
}

const FeatureFlagItem: React.FC<{ flagKey: FeatureName }> = ({ flagKey }) => {
  const config = GlobalStore.useAppState((s) => s.config)
  const currentValue = config.features[flagKey]
  const isAdminOverrideInEffect = config.adminFeatureFlagOverrides[flagKey] != null
  const valText = currentValue ? "Yes" : "No"
  return (
    <MenuItem
      title={features[flagKey].description ?? flagKey}
      onPress={() => {
        Alert.alert(features[flagKey].description ?? flagKey, undefined, [
          {
            text: "Override with 'Yes'",
            onPress() {
              GlobalStore.actions.config.setAdminOverride({ key: flagKey, value: true })
            },
          },
          {
            text: "Override with 'No'",
            onPress() {
              GlobalStore.actions.config.setAdminOverride({ key: flagKey, value: false })
            },
          },
          {
            text: isAdminOverrideInEffect ? "Revert to default value" : "Keep default value",
            onPress() {
              GlobalStore.actions.config.setAdminOverride({ key: flagKey, value: null })
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
