import { Flex, useColor } from "palette"
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory-native"
import { data } from "./testHelpers"

import { useCallback } from "react"
import { Defs, LinearGradient, Stop } from "react-native-svg"
import { getColorByMedium } from "./helpers"
import { LineGraphStore } from "./LineGraphStore"

const CIRCLE_DIAMETER = 8

const ANIMATION_CONFIG = {
  duration: 2000,
  onLoad: { duration: 1000 },
}

export const LineGraphChart = () => {
  const color = useColor()
  const selectedMedium = LineGraphStore.useStoreState((state) => state.selectedMedium)
  const selectedDuration = LineGraphStore.useStoreState((state) => state.selectedDuration)

  const renderDefs = useCallback(
    () => (
      <Defs>
        <LinearGradient id="gradientStroke" gradientTransform="rotate(90)">
          <Stop
            offset="0%"
            stopColor={getColorByMedium(selectedMedium) || "#707070 "}
            stopOpacity="20%"
          />
          <Stop offset="100%" stopColor="white" />
        </LinearGradient>
      </Defs>
    ),
    [selectedMedium]
  )

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      minDomain={{ y: 0 }}
      maxDomain={{ y: 10 }}
      backgroundComponent={<Backgound />}
      containerComponent={<VictoryVoronoiContainer labels={({ datum }) => `${datum.y}`} />}
      style={{
        background: { fill: "white" },
      }}
    >
      {renderDefs()}

      <VictoryArea
        style={{
          // data: { fill: "#c43a31" }
          data: { fill: "url(#gradientStroke)" },
        }}
        data={data[0].values}
        animate={ANIMATION_CONFIG}
        interpolation="natural"
      />

      <VictoryAxis
        dependentAxis
        tickValues={[0, 10]}
        domain={{ y: [0, 10] }}
        maxDomain={{ y: 10 }}
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: color("blue10"), size: 5 },
        }}
      />
      <VictoryAxis />
    </VictoryChart>
  )
}

const Backgound = (props: any) => (
  <Flex
    position="absolute"
    width={props.width}
    height={props.height}
    left={props.x}
    top={props.y}
  />
)
