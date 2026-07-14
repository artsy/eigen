import { OwnerType } from "@artsy/cohesion"
import { PersonIcon } from "@artsy/icons/native"
import { Box, Flex } from "@artsy/palette-mobile"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { GlobalStore } from "app/store/GlobalStore"
import { RouterLink } from "app/system/navigation/RouterLink"
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
          <Flex alignItems="flex-end">
            <Box justifyContent="center">
              <RouterLink to="/my-profile" accessibilityLabel="Profile" hitSlop={ICON_HIT_SLOP}>
                <PersonIcon height={24} width={24} />
              </RouterLink>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
})
