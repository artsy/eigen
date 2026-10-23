import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellNavigationProp, SellNavigationRoutes } from "app/Scenes/Sell/Sell"

export const SelectWorks: React.FC = () => {
  const navigation = useNavigation<SellNavigationProp>()
  const { params } = useRoute<RouteProp<SellNavigationRoutes, "SelectWorks">>()

  if (!params?.showWorksSummary) {
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
