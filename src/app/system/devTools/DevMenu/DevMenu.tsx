import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"

import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { AuthenticatedRoutesParams } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { LargeHeaderView } from "app/Navigation/Utils/LargeHeaderView"
import { GlobalStore } from "app/store/GlobalStore"
import { CodePushOptions } from "app/system/devTools/DevMenu/CodePushOptions"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { DevTools } from "app/system/devTools/DevMenu/Components/DevTools"
import { EnvironmentOptions } from "app/system/devTools/DevMenu/Components/EnvironmentOptions"
import { Experiments } from "app/system/devTools/DevMenu/Components/Experiments"
import { FeatureFlags } from "app/system/devTools/DevMenu/Components/FeatureFlags"
import { NavButtons } from "app/system/devTools/DevMenu/Components/NavButtons"
import { NavigateTo } from "app/system/devTools/DevMenu/Components/NavigateTo"
import { goBack } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect } from "react"
import { NativeModules, ScrollView } from "react-native"
import DeviceInfo from "react-native-device-info"

export const DevMenu = ({ onClose = () => goBack() }: { onClose(): void }) => {
  const userEmail = GlobalStore.useAppState((s) => s.auth.userEmail)
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")
  const navigation = useNavigation<NavigationProp<AuthenticatedRoutesParams, "DevMenu">>()

  const handleBackButton = () => {
    onClose()
    return true
  }

  useBackHandler(handleBackButton)

  useEffect(() => {
    queueMicrotask(() => {
      if (enableNewNavigation) {
        navigation?.setOptions({
          headerRight: () => (
            <Flex justifyContent="center" alignItems="center">
              <NavButtons onClose={onClose} />
            </Flex>
          ),
        })
      }
    })
  }, [navigation])

  return (
    <ScrollView
      style={{ flex: 1, borderRadius: 4, overflow: "hidden" }}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {!!enableNewNavigation && <LargeHeaderView />}

      {!enableNewNavigation && (
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mb={2} pr={2}>
          <Text variant="lg-display" px={2}>
            Dev Settings
          </Text>
          <NavButtons onClose={onClose} />
        </Flex>
      )}

      <Text variant="xs" color="grey" mx={2} mt={2}>
        Build:{" "}
        <Text variant="xs">
          v{DeviceInfo.getVersion()}, build {DeviceInfo.getBuildNumber()} (
          {ArtsyNativeModule.gitCommitShortHash})
        </Text>
      </Text>
      <Text variant="xs" color="grey" mx={2}>
        Email: <Text variant="xs">{userEmail}</Text>
      </Text>
      <DevMenuButtonItem title="Open RN Dev Menu" onPress={() => NativeModules?.DevMenu?.show()} />
      <Spacer y={2} />
      <Join separator={<Spacer y={1} />}>
        <NavigateTo />
        <EnvironmentOptions onClose={onClose} />
        <CodePushOptions />
        <FeatureFlags />
        <Experiments />
        <DevTools />
      </Join>
    </ScrollView>
  )
}
