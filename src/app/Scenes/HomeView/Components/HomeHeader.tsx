import { OwnerType } from "@artsy/cohesion"
import { Flex, MenuIcon, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { GlobalSearchInput } from "app/Components/GlobalSearchInput/GlobalSearchInput"
import { PaymentFailureBanner } from "app/Scenes/HomeView/Components/PaymentFailureBanner"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Suspense } from "react"

export const HomeHeader: React.FC = () => {
  const showPaymentFailureBanner = useFeatureFlag("AREnablePaymentFailureBanner")
  const navigation = useNavigation()

  return (
    <Flex backgroundColor="background">
      {!!showPaymentFailureBanner && (
        <Suspense fallback={null}>
          <PaymentFailureBanner />
        </Suspense>
      )}

      <Flex pb={1} pt={2}>
        <Flex flexDirection="row" px={2} gap={1} justifyContent="space-around" alignItems="center">
          <Flex alignItems="flex-start">
            <Touchable onPress={navigation.openDrawer}>
              <MenuIcon width={24} height={24} />
            </Touchable>
          </Flex>
          <Flex flex={1}>
            <GlobalSearchInput ownerType={OwnerType.home} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
