import { Flex, Spacer } from "palette"
import React from "react"
import { LineGraphBandProps, LineGraphBands } from "./LineGraphBands"
import { LineGraphChart } from "./LineGraphChart"
import { LineGraphIndex } from "./LineGraphIndex"
import { _AVAILABLE_MEDIUMS } from "./testHelpers"
import { LineChartData } from "./types"

interface Props {
  data: LineChartData
  showHighlights?: boolean
  bands: LineGraphBandProps["bands"]
  selectedBand?: string
  onBandSelected: LineGraphBandProps["onBandSelected"]
}

export const LineGraph: React.FC<Props> = ({
  bands,
  data,
  onBandSelected,
  selectedBand,
  showHighlights,
}) => {
  return (
    <Flex mt={5}>
      {/* <LineGraphIndex /> */}
      <LineGraphChart data={data.data} dataMeta={data.dataMeta} showHighlights={showHighlights} />
      <LineGraphBands bands={bands} selectedBand={selectedBand} onBandSelected={onBandSelected} />
      <Spacer mb={0.5} />
      {/* <LineGraphMediumPicker /> */}
    </Flex>
  )
}
