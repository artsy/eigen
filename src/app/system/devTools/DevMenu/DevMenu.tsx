import { Flex, Join, Screen, Spacer, Text, useSpace } from "@artsy/palette-mobile"

import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
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
import { NativeModules, Platform, ScrollView } from "react-native"
import DeviceInfo from "react-native-device-info"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const DevMenu = ({ onClose = () => goBack() }: { onClose(): void }) => {
  const userEmail = GlobalStore.useAppState((s) => s.auth.userEmail)
  const space = useSpace()

  const handleBackButton = () => {
    onClose()
    return true
  }

  useBackHandler(handleBackButton)

  const { top: topInset } = useSafeAreaInsets()

  const androidTopInset = Platform.OS === "android" ? topInset : 0

  return (
    <Screen>
      <Flex flexDirection="row" justifyContent="space-between" mt={`${androidTopInset}px`}>
        <Text variant="lg-display" pb={2} px={2}>
          Dev Settings
        </Text>
        <NavButtons onClose={onClose} />
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
    </Screen>
  )
}
