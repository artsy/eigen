import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/navigation/navigate"
import { Text } from "palette"
import { View } from "react-native"
import { CareerHightlightsPromotionalCard } from "./CareerHighlightsPromotionalCard"

export const CareerHightlightsCards = () => {
  return (
    <>
      <FancyModalHeader rightCloseButton onRightButtonPress={() => goBack()} hideBottomDivider>
        <View style={{ backgroundColor: "pink" }}>
          <Text>here should be a cool scroll thingy</Text>
        </View>
      </FancyModalHeader>
      <CareerHightlightsPromotionalCard />
    </>
  )
}
