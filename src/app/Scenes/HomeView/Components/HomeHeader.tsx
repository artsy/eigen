import { ArtsyLogoBlackIcon, Flex, Box } from "@artsy/palette-mobile"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Suspense } from "react"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const showPaymentFailureBanner = useFeatureFlag("AREnablePaymentFailureBanner")
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  return (
    <>
      {!!showPaymentFailureBanner && (
        <Suspense fallback={null}>
          <PaymentFailureBanner />
        </Suspense>
      )}
      <Box py={2}>
        <Flex flexDirection="row" px={2} justifyContent="space-between" alignItems="center">
          <Box flex={1} />
          <Box>
            <ArtsyLogoBlackIcon scale={0.75} />
          </Box>
          <Box flex={1} alignItems="flex-end">
            <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
          </Box>
        </Flex>
      </Box>
    </>
  )
}
