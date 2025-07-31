import { OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME } from "app/store/ProgressiveOnboardingModel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { memo } from "react"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = memo(() => {
  const showPaymentFailureBanner = useFeatureFlag("AREnablePaymentFailureBanner")
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  const {
    isDismissed: isDismissedFn,
    dismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isDismissed = isDismissedFn(PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME).status
  return (
    <Flex backgroundColor="background">
      <Flex>
        <Text>{isDismissed ? "isDismissed" : "NOT DISMISSED!"}</Text>
        <Text>{isReady ? "isReady" : "NOT READY!"}</Text>
        <Text>
          Dismissed keys:{" "}
          {dismissed.length > 0 ? dismissed.map((item) => item.key).join(", ") : "None"}
        </Text>
        <Text>HOME</Text>
      </Flex>
      {!!showPaymentFailureBanner && <PaymentFailureBanner />}
      <Flex pb={1} pt={2}>
        <Flex flexDirection="row" px={2} gap={1} justifyContent="space-around" alignItems="center">
          <Flex flex={1}>
            <GlobalSearchInput ownerType={OwnerType.home} />
          </Flex>
          <Flex alignItems="flex-end">
            <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
})
