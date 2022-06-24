import { Flex, useColor } from "palette"
import React from "react"
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory-native"
import { data } from "./testHelpers"

const CIRCLE_DIAMETER = 8

export const LineGraphChart = () => {
  const color = useColor()

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
      <VictoryLine
        style={{
          data: { stroke: color("blue100") },
        }}
        data={data[0].values}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 },
        }}
      />
      <VictoryScatter dataComponent={<CirclePoint />} data={data[0].values} />

      <VictoryAxis
        dependentAxis
        tickValues={[0, 10]}
        domain={{ x: [0, 5], y: [0, 10] }}
        maxDomain={{ y: 10 }}
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: color("blue10"), size: 5 },
        }}
      />
    </VictoryChart>
  )
}

const Backgound = (props: any) => (
  <Flex position="absolute" width={props.width} height={props.height} left={props.x} top={props.y}>
    {/* <Image
      source={require("images/LineGraphBackgroundSlider.webp")}
      width={props.width}
      height={props.height}
      resizeMode="cover"
      style={{
        height: props.height,
        width: props.width,
      }}
    /> */}
  </Flex>
)

const CirclePoint = (props) => {
  const { x, y } = props
  const color = useColor()
  return (
    <Flex
      position="absolute"
      left={x - CIRCLE_DIAMETER / 2}
      top={y - CIRCLE_DIAMETER / 2}
      backgroundColor="white"
      borderColor={color("blue100")}
      borderWidth={1}
      height={CIRCLE_DIAMETER}
      width={CIRCLE_DIAMETER}
      borderRadius={CIRCLE_DIAMETER / 2}
    />
  )
}
