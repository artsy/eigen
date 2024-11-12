import { ArtsyLogoBlackIcon, Box, Flex, RoundSearchInput, Touchable } from "@artsy/palette-mobile"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { SEARCH_INPUT_PLACEHOLDER } from "app/Scenes/Search/Search"
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
      <Flex>
        {!!showPaymentFailureBanner && (
          <Suspense fallback={null}>
            <PaymentFailureBanner />
          </Suspense>
        )}
        <Flex py={2}>
          <Flex
            flexDirection="row"
            px={2}
            gap={2}
            justifyContent="space-around"
            alignItems="center"
          >
            <Flex flex={1}>
              <Touchable onPress={() => {}}>
                <Flex pointerEvents="none">
                  <RoundSearchInput
                    placeholder={SEARCH_INPUT_PLACEHOLDER}
                    accessibilityHint="Search artists, artworks, galleries etc."
                    accessibilityLabel="Search artists, artworks, galleries etc."
                    maxLength={55}
                    numberOfLines={1}
                    multiline={false}
                  />
                </Flex>
              </Touchable>
            </Flex>
            <Flex alignItems="flex-end">
              <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
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
