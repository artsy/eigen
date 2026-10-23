import { useNavigation } from "@react-navigation/native"
import { SellStepIntro } from "app/Scenes/Sell/Components/SellStepIntro"
import { SellStepLayout } from "app/Scenes/Sell/Components/SellStepLayout"
import { SellNavigationProp } from "app/Scenes/Sell/Sell"
import { ScrollView } from "react-native"

export const Condition: React.FC = () => {
  const navigation = useNavigation<SellNavigationProp>()

  return (
    <SellStepLayout
      buttonLabel="Continue"
      onButtonPress={() => navigation.navigate("LocationAndContact")}
    >
      <ScrollView>
        <SellStepIntro stepName="Condition" px={2} />
      </ScrollView>
    </SellStepLayout>
  )
}
