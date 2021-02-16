import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Box, CheckIcon, color, Flex, Separator, Text } from "palette"
import React, { useContext, useState } from "react"
import { TouchableOpacity } from "react-native"
import Haptic from "react-native-haptic-feedback"
import styled from "styled-components/native"
import { FilterData } from "../../utils/ArtworkFilter/ArtworkFiltersStore"
import { useScreenDimensions } from "../../utils/useScreenDimensions"
import { CircleWithBorder } from "../CircleWithBorder/CircleWithBorder"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"
import { FilterModalNavigationStack } from "../FilterModal"

interface YearOptionsScreenProps extends StackScreenProps<FilterModalNavigationStack, "YearOptionsScreen"> {}

export const ALLOW_EMPTY_CREATED_DATES_FILTER: FilterData = {
  displayText: "Include lots without artwork date listed",
  paramName: FilterParamName.allowEmptyCreatedDates,
  paramValue: true,
}

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

  const appliedAllowEmptyCreatedDates = state.appliedFilters.find(
    (option) => option.paramName === FilterParamName.allowEmptyCreatedDates
  )?.paramValue as boolean
  const selectedAllowEmptyCreatedDates = state.selectedFilters.find(
    (option) => option.paramName === FilterParamName.allowEmptyCreatedDates
  )?.paramValue as boolean

  const [sliderValues, setSliderValues] = useState([
    appliedEarliestCreatedYear || artistEarliestCreatedYear,
    appliedLatestCreatedYear || artistLatestCreatedYear,
  ])

  const [allowEmptyCreatedDates, setAllowEmptyCreatedDates] = useState<boolean>(
    selectedAllowEmptyCreatedDates ?? appliedAllowEmptyCreatedDates ?? true
  )

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

  const handleAllowEmptyCreatedDatesPress = () => {
    dispatch({
      type: "selectFilters",
      payload: {
        displayText: ALLOW_EMPTY_CREATED_DATES_FILTER.displayText,
        paramValue: !allowEmptyCreatedDates,
        paramName: FilterParamName.allowEmptyCreatedDates,
      },
    })

    setAllowEmptyCreatedDates(!allowEmptyCreatedDates)
  }

  return (
    <Flex flexGrow={1}>
      <FancyModalHeader onLeftButtonPress={navigation.goBack}>Year created</FancyModalHeader>
      <Flex flexGrow={1} py={2}>
        <YearText variant="text" mb={15} mx={2}>
          {sliderValues[0]} – {sliderValues[1]}
        </YearText>
        <Flex alignItems="center" mx={2}>
          <MultiSlider
            values={[Number(sliderValues[0]), Number(sliderValues[1])]}
            sliderLength={screenWidth - 40}
            onValuesChange={(values) => {
              Haptic.trigger("impactLight")
              setSliderValues(values)
            }}
            onValuesChangeFinish={onValuesChangeFinish}
            min={artistEarliestCreatedYear}
            max={artistLatestCreatedYear}
            step={1}
            allowOverlap
            snapped
            customMarker={() => (
              <CircleWithBorder
                borderWidth={2}
                backgroundColor={color("black100")}
                borderColor={color("white100")}
                diameter={24}
                top="2px"
              />
            )}
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
        <Separator mt={2} />
        <OptionItem
          onPress={handleAllowEmptyCreatedDatesPress}
          text={ALLOW_EMPTY_CREATED_DATES_FILTER.displayText}
          selected={allowEmptyCreatedDates}
        />
      </Flex>
    </Flex>
  )
}

interface OptionItemProps {
  onPress: () => void
  text: string
  selected: boolean
}

export const OptionItem = ({ onPress, text, selected }: OptionItemProps) => (
  <TouchableOpacity onPress={onPress}>
    <Flex flexGrow={1} justifyContent="space-between" flexDirection="row" height={60}>
      <Flex flexDirection="row" justifyContent="space-between" flexGrow={1} alignItems="center" pl={2} pr={2}>
        <Text variant="text">{text}</Text>
        {!!selected && (
          <Box mb={0.1}>
            <CheckIcon fill="black100" />
          </Box>
        )}
      </Flex>
    </Flex>
  </TouchableOpacity>
)

export const YearText = styled(Text)`
  margin-bottom: 15;
`
