import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"

import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { AuthenticatedRoutesParams } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { LargeHeaderView } from "app/Navigation/utils/LargeHeaderView"
import { __unsafe__onboardingNavigationRef } from "app/Scenes/Onboarding/Onboarding"
import { GlobalStore } from "app/store/GlobalStore"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { DevTools } from "app/system/devTools/DevMenu/Components/DevTools"
import { EnvironmentOptions } from "app/system/devTools/DevMenu/Components/EnvironmentOptions"
import { Experiments } from "app/system/devTools/DevMenu/Components/Experiments"
import { ExpoUpdatesOptions } from "app/system/devTools/DevMenu/Components/ExpoUpdatesOptions"
import { FeatureFlags } from "app/system/devTools/DevMenu/Components/FeatureFlags"
import { NavButtons } from "app/system/devTools/DevMenu/Components/NavButtons"
import { NavigateTo } from "app/system/devTools/DevMenu/Components/NavigateTo"
import { PushNotificationOptions } from "app/system/devTools/DevMenu/Components/PushNotificationOptions"
import { goBack } from "app/system/navigation/navigate"
import { getAppVersion, getBuildNumber } from "app/utils/appVersion"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import React, { useEffect } from "react"
import { Alert, NativeModules, PixelRatio, ScrollView } from "react-native"

export const DevMenu: React.FC<{}> = () => {
  const userEmail = GlobalStore.useAppState((s) => s.auth.userEmail)
  const fontScale = PixelRatio.getFontScale()
  const navigation = useNavigation<NavigationProp<AuthenticatedRoutesParams, "DevMenu">>()
  const setDarkModeOption = GlobalStore.actions.devicePrefs.setDarkModeOption

  const handleBackButton = () => {
    goBack()
    return true
  }

  useBackHandler(handleBackButton)

  useEffect(() => {
    navigation?.setOptions({
      headerRight: () => (
        <Flex justifyContent="center" alignItems="center">
          <NavButtons onClose={goBack} />
        </Flex>
      ),
    })
  }, [navigation])

  const handleDarkModePress = () => {
    Alert.alert("Dark Mode", undefined, [
      {
        text: "On",
        onPress() {
          setDarkModeOption("on")
        },
      },
      {
        text: "Off",
        onPress() {
          setDarkModeOption("off")
        },
      },
      {
        text: "Follow System",
        onPress() {
          setDarkModeOption("system")
        },
      },
      {
        text: "Cancel",
        style: "destructive",
      },
    ])
  }

  return (
    <ScrollView
      style={{ flex: 1, borderRadius: 4, overflow: "hidden" }}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {
        // The logged out stack is using a js react-navigation stack instead of a native stack
        // and it doesn't support large headers so we don't need this additional header
        !__unsafe__onboardingNavigationRef.current ? <LargeHeaderView /> : null
      }
      <Text variant="xs" color="grey" mx={2} mt={2}>
        Build:{" "}
        <Text variant="xs">
          v{getAppVersion()}, build {getBuildNumber()} ({ArtsyNativeModule.gitCommitShortHash})
        </Text>
      </Text>
      <Text variant="xs" color="grey" mx={2}>
        Email: <Text variant="xs">{userEmail}</Text>
      </Text>
      <Text variant="xs" color="grey" mx={2}>
        Font scale: <Text variant="xs">{fontScale}</Text>
      </Text>
      <DevMenuButtonItem title="Open RN Dev Menu" onPress={() => NativeModules?.DevMenu?.show()} />
      <DevMenuButtonItem title="Dark Mode 🌙" onPress={handleDarkModePress} />
      <Join separator={<Spacer y={1} />}>
        <NavigateTo />
        <EnvironmentOptions onClose={goBack} />
        <ExpoUpdatesOptions />
        <PushNotificationOptions />
        <FeatureFlags />
        <Experiments />
        <DevTools />
      </Join>
    </ScrollView>
  )
}
