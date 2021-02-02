import AsyncStorage from "@react-native-community/async-storage"
import { MenuItem } from "lib/Components/MenuItem"
import { dismissModal, navigate } from "lib/navigation/navigate"
import { FeatureName, features } from "lib/store/features"
import { GlobalStore } from "lib/store/GlobalStore"
import { sortBy } from "lodash"
import { CloseIcon, Flex, Separator, Text } from "palette"
import React from "react"
import { Alert, DevSettings, Platform, ScrollView, TouchableOpacity, View } from "react-native"
import { useScreenDimensions } from "./useScreenDimensions"

const configurableFeatureFlagKeys = sortBy(
  Object.entries(features).filter(([_, { description }]) => description),
  ([_, { description }]) => description
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
        backgroundColor: "lightcoral",
      }}
      px="2"
      pb="2"
      pt={useScreenDimensions().safeAreaInsets.top + 20}
    >
      <Text color="white" variant="largeTitle" pb="2">
        Admin Settings
      </Text>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white", borderRadius: 4, overflow: "hidden" }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <MenuItem
          title="Clear AsyncStorage"
          chevron={null}
          onPress={() => {
            AsyncStorage.clear()
          }}
        />
        {!!__DEV__ && (
          <MenuItem
            title="Clear AsyncStorage and reload"
            chevron={null}
            onPress={() => {
              AsyncStorage.clear()
              DevSettings.reload()
            }}
          />
        )}
        <MenuItem
          title="Throw Sentry Error"
          onPress={() => {
            throw Error("Sentry test error")
          }}
          chevron={null}
        />
        {Platform.OS === "ios" && (
          <MenuItem
            title="Show old admin menu"
            onPress={() => {
              navigate("/admin", { modal: true })
            }}
            chevron={null}
          />
        )}
        <Separator my="1"></Separator>
        <Text variant="title" px="2" my="1">
          Feature flags
        </Text>
        {configurableFeatureFlagKeys.map((flagKey) => {
          return <FeatureFlagItem flagKey={flagKey} />
        })}
      </ScrollView>
      <CloseButton onPress={onClose} />
    </Flex>
  )
}

const CloseButton: React.FC<{ onPress(): void }> = ({ onPress }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 17,
        right: 17,
        backgroundColor: "white",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={onPress}>
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
      title={features[flagKey].description}
      onPress={() => {
        Alert.alert(features[flagKey].description!, undefined, [
          {
            text: "Override to 'Yes'",
            onPress() {
              GlobalStore.actions.config.setAdminOverride({ key: flagKey, value: true })
            },
          },
          {
            text: "Override to 'No'",
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
          <Text variant="mediumText" color="black">
            {valText}
          </Text>
        ) : (
          <Text>{valText}</Text>
        )
      }
    />
  )
}
