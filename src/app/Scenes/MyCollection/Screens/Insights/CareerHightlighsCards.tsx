import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/navigation/navigate"
import { Text } from "palette"
import { View } from "react-native"
import { CareerHighlightsPromotionalCard } from "./CareerHighlightsPromotionalCard"

export const CareerHighlightsCards = () => {
  return (
    <>
      <FancyModalHeader rightCloseButton onRightButtonPress={() => goBack()} hideBottomDivider>
        <View style={{ backgroundColor: "pink" }}>
          <Text>here should be a cool scroll thingy</Text>
        </View>
      </FancyModalHeader>
      <CareerHighlightsPromotionalCard />
    </>
  )
}
