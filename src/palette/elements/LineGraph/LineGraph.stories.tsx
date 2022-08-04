import { storiesOf } from "@storybook/react-native"
import { LineGraph } from "."
import { Flex } from ".."
import { getRandomColor } from "./helpers"
import { _AVAILABLE_MEDIUMS, testChartData } from "./testHelpers"

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
