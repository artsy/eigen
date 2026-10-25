import { useNavigation } from "@react-navigation/native"
import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellNavigationProp } from "app/Scenes/Sell/Sell"

export const Condition: React.FC = () => {
  const navigation = useNavigation<SellNavigationProp>()

  return (
    <SellStepLayout
      buttonLabel="Continue"
      onButtonPress={() => navigation.navigate("LocationAndContact")}
    />
  )
}
