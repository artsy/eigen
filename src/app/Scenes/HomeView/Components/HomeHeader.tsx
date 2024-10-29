import { ArtsyLogoBlackIcon, Flex, Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Suspense } from "react"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const enableNewSearchModal = useFeatureFlag("AREnableNewSearchModal")
  const showPaymentFailureBanner = useFeatureFlag("AREnablePaymentFailureBanner")
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  if (enableNewSearchModal) {
    return (
      <>
        {!!showPaymentFailureBanner && (
          <Suspense fallback={null}>
            <PaymentFailureBanner />
          </Suspense>
        )}
        <Flex py={2}>
          <Flex flexDirection="row" px={2} justifyContent="space-around" alignItems="center">
            <Flex flex={1}>
              <Button block variant="fillGray" alignItems="flex-start" disabled>
                <SearchIcon />
                <Spacer x={2} />
                <Text variant="sm-display">Search Artsy</Text>
              </Button>
            </Flex>
            <Flex width={50} alignItems="flex-end">
              <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
            </Flex>
          </Flex>
        </Flex>
      </>
    )
  }

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
