import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Button, Text } from "@artsy/palette-mobile"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
  channel,
  runtimeVersion,
} from "expo-updates"
import { Suspense } from "react"
import { Alert } from "react-native"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const showPaymentFailureBanner = useFeatureFlag("AREnablePaymentFailureBanner")
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  const onFetchUpdateAsync = async () => {
    try {
      const update = await checkForUpdateAsync()

      console.error("UPDATES: Full update object", JSON.stringify(update, null, 2))
      console.error("UPDATES: Current channel", channel)
      console.error("UPDATES: Runtime version", runtimeVersion)

      if (update.isAvailable) {
        const result = await fetchUpdateAsync()
        console.error("UPDATES: Update result", result)
        await reloadAsync()
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      Alert.alert(`Error fetching latest Expo update: ${error}`)
    }
  }

  return (
    <Flex backgroundColor="background">
      {!!showPaymentFailureBanner && (
        <Suspense fallback={null}>
          <PaymentFailureBanner />
        </Suspense>
      )}

      <Flex pb={1} pt={2}>
        <Flex flexDirection="row" px={2} gap={1} justifyContent="space-around" alignItems="center">
          <Flex flex={1}>
            <GlobalSearchInput ownerType={OwnerType.home} />
          </Flex>
          <Flex alignItems="flex-end">
            <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
          </Flex>
        </Flex>
        <Box backgroundColor="purple">
          <Flex alignContent="center" justifyContent="center" alignItems="center" p={2}>
            <Button onPress={() => onFetchUpdateAsync()}>Fetch Update New</Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  )
}
