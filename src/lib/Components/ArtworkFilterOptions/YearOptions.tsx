import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { color, Flex, Text } from "palette"
import React, { useContext, useState } from "react"
import styled from "styled-components/native"
import { useScreenDimensions } from "../../utils/useScreenDimensions"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"
import { FilterModalNavigationStack } from "../FilterModal"
import { CustomLabel } from "./MultiSliderCustomLabel"

interface YearOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "YearOptionsScreen"> {}

export const YearOptionsScreen: React.FC<YearOptionsScreenProps> = ({ navigation }) => {
  const screenWidth = useScreenDimensions().width
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const artistEarliestCreatedYear = Number(
    aggregationForFilter(FilterParamName.earliestCreatedYear, state.aggregations)?.counts[0].value
  )
  const artistLatestCreatedYear = Number(
    aggregationForFilter(FilterParamName.latestCreatedYear, state.aggregations)?.counts[0].value
  )

  const selectedOptions = useSelectedOptionsDisplay()

  const appliedEarliestCreatedYear = selectedOptions.find(
    (option) => option.paramName === FilterParamName.earliestCreatedYear
  )?.paramValue
  const appliedLatestCreatedYear = selectedOptions.find(
    (option) => option.paramName === FilterParamName.latestCreatedYear
  )?.paramValue

  const [sliderValues, setSliderValues] = useState([
    appliedEarliestCreatedYear || artistEarliestCreatedYear,
    appliedLatestCreatedYear || artistLatestCreatedYear,
  ])

  const onValuesChangeFinish = (values: number[]) => {
    const earliestCreatedYear = values[0]
    const latestCreatedYear = values[1]

    dispatch({
      type: "selectFilters",
      payload: {
        displayText: earliestCreatedYear.toString(),
        paramValue: earliestCreatedYear,
        paramName: FilterParamName.earliestCreatedYear,
      },
    })

    dispatch({
      type: "selectFilters",
      payload: {
        displayText: latestCreatedYear.toString(),
        paramValue: latestCreatedYear,
        paramName: FilterParamName.latestCreatedYear,
      },
    })
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={navigation.goBack}>Year created</FancyModalHeader>
      <Flex flexGrow={1} p={2}>
        <YearText variant="text" mb={15}>
          {sliderValues[0]} - {sliderValues[1]}{" "}
        </YearText>
        <Flex alignItems="center">
          <MultiSlider
            values={[Number(sliderValues[0]), Number(sliderValues[1])]}
            sliderLength={screenWidth - 60}
            onValuesChange={setSliderValues}
            onValuesChangeFinish={onValuesChangeFinish}
            min={artistEarliestCreatedYear}
            max={artistLatestCreatedYear}
            step={1}
            allowOverlap
            snapped
            customLabel={CustomLabel}
            selectedStyle={{
              backgroundColor: "black",
              height: 5,
            }}
            unselectedStyle={{
              backgroundColor: color("black10"),
              height: 5,
            }}
            containerStyle={{
              height: 40,
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export const YearText = styled(Text)`
  margin-bottom: 15;
`
