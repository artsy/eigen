import { ArtsyLogoBlackIcon, Flex, Box, useSpace } from "@artsy/palette-mobile"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const showPaymentFailureBanner = useFeatureFlag("AREnablePaymentFailureBanner")
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  const space = useSpace()

  return (
    <>
      {!!showPaymentFailureBanner && <PaymentFailureBanner />}
      <Box style={{ paddingTop: space(2), paddingBottom: space(2) }}>
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
