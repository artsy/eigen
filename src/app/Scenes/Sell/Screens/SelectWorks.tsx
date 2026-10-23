import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellNavigationProp, SellNavigationRoutes } from "app/Scenes/Sell/Sell"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useCallback } from "react"

export const SelectWorks: React.FC = () => {
  const navigation = useNavigation<SellNavigationProp>()
  const { params } = useRoute<RouteProp<SellNavigationRoutes, "SelectWorks">>()
  const showWorksSummary = !!params?.showWorksSummary

  const handleHardwareBack = useCallback(() => {
    if (!showWorksSummary) {
      return false
    }

    navigation.setParams({ showWorksSummary: false })
    return true
  }, [navigation, showWorksSummary])

  useBackHandler(handleHardwareBack)

  if (!showWorksSummary) {
    return (
      <SellStepLayout
        buttonLabel="Verify If Sellable"
        onButtonPress={() => navigation.setParams({ showWorksSummary: true })}
      />
    )
  }

  return (
    <SellStepLayout
      buttonLabel="Start Consignment"
      onButtonPress={() => navigation.navigate("Condition")}
    />
  )
}
