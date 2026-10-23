import { BackButton, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { CommonActions, NavigationContainerRefWithCurrent, Route } from "@react-navigation/native"
import { ICON_HIT_SLOP } from "app/Components/constants"
import { SellStepper } from "app/Scenes/Sell/Components/SellStepper"
import { SellNavigationRoutes } from "app/Scenes/Sell/Sell"
import { SELL_STEPS } from "app/Scenes/Sell/sellSteps"
// eslint-disable-next-line no-restricted-imports
import { dismissModal } from "app/system/navigation/navigate"
import { Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export type SellRoute = Route<string, object | undefined>

interface SellHeaderProps {
  route: SellRoute
  navigationRef: NavigationContainerRefWithCurrent<SellNavigationRoutes>
}

export const SellHeader: React.FC<SellHeaderProps> = ({ route, navigationRef }) => {
  const { top } = useSafeAreaInsets()
  const space = useSpace()

  const currentStepIndex = SELL_STEPS.findIndex((step) => step.name === route.name)
  const isWorksSummary =
    route.name === "SelectWorks" &&
    !!(route.params as SellNavigationRoutes["SelectWorks"])?.showWorksSummary
  const isFirstScreen = !isWorksSummary && !navigationRef.canGoBack()

  const handleBack = () => {
    if (isWorksSummary) {
      navigationRef.dispatch({
        ...CommonActions.setParams({ showWorksSummary: false }),
        source: route.key,
      })
    } else {
      navigationRef.goBack()
    }
  }

  const handleClose = () => {
    Alert.alert("Leave this flow?", "Your progress on this submission won't be saved.", [
      { text: "Keep going", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: () => dismissModal() },
    ])
  }

  return (
    <Flex bg="mono0" px={2} pb={1} gap={2} style={{ paddingTop: top + space(1) }}>
      <Flex flexDirection="row" justifyContent="center" alignItems="center" gap={1} px={4}>
        <Text variant="sm-display">Sell</Text>

        <Flex backgroundColor="blue10" borderRadius={15} px={1} py={0.5}>
          <Text variant="xxs" color="blue100">
            Beta
          </Text>
        </Flex>

        {!isFirstScreen && (
          <Flex position="absolute" left={0}>
            <BackButton hitSlop={ICON_HIT_SLOP} onPress={handleBack} />
          </Flex>
        )}

        <Flex position="absolute" right={0}>
          <BackButton
            showX
            hitSlop={ICON_HIT_SLOP}
            onPress={isFirstScreen ? () => dismissModal() : handleClose}
          />
        </Flex>
      </Flex>

      <SellStepper currentStepIndex={currentStepIndex} />
    </Flex>
  )
}
