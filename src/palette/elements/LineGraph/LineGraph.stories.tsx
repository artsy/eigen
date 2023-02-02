import { Flex } from "@artsy/palette-mobile"
import { storiesOf } from "@storybook/react-native"
import { LineGraph } from "."
import { _AVAILABLE_MEDIUMS, testChartData } from "./testHelpers"

// Helper to get a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

storiesOf("LineGraph", module).add("LineGraph", () => (
  <Flex mx={2} my={2}>
    <LineGraph
      data={testChartData}
      bands={[{ name: "3 yrs" }, { name: "8 yrs" }]}
      onBandSelected={(band) => console.log(`${band} selected`)}
      showHighlights
      categories={_AVAILABLE_MEDIUMS.map((a) => ({ name: a, color: getRandomColor() }))}
      selectedCategory={_AVAILABLE_MEDIUMS[0]}
      onCategorySelected={(category) => console.log("SELECTED CATEGORY", category)}
      onXHighlightPressed={(datum) => console.log("DATUM", datum)}
    />
  </Flex>
))
