import { OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { memo } from "react"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = memo(() => {
  const showPaymentFailureBanner = useFeatureFlag("AREnablePaymentFailureBanner")
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  return (
    <Flex backgroundColor="background">
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
