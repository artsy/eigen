import { CheckmarkIcon } from "@artsy/icons/native"
import { range, Flex, Box, useColor, Text, Separator } from "@artsy/palette-mobile"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  aggregationForFilter,
  FilterData,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworksFiltersStore,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { TouchableRow } from "app/Components/TouchableRow"
import { useScreenDimensions } from "app/utils/hooks"
import React, { useState } from "react"
import Haptic from "react-native-haptic-feedback"

type YearOptionsScreenProps = StackScreenProps<ArtworkFilterNavigationStack, "YearOptionsScreen">

export const ALLOW_EMPTY_CREATED_DATES_FILTER: FilterData = {
  displayText: "Include Lots without Artwork Date Listed",
  paramName: FilterParamName.allowEmptyCreatedDates,
  paramValue: true,
}

export const YearOptionsScreen: React.FC<YearOptionsScreenProps> = ({ navigation }) => {
  const color = useColor()
  const screenWidth = useScreenDimensions().width

  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const selectedFilters = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)

  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )

  const artistEarliestCreatedYear = Number(
    aggregationForFilter(FilterParamName.earliestCreatedYear, aggregations)?.counts[0].value
  )
  const artistLatestCreatedYear = Number(
    aggregationForFilter(FilterParamName.latestCreatedYear, aggregations)?.counts[0].value
  )

  const selectedOptions = useSelectedOptionsDisplay()

  const appliedEarliestCreatedYear = selectedOptions.find(
    (option) => option.paramName === FilterParamName.earliestCreatedYear
  )?.paramValue
  const appliedLatestCreatedYear = selectedOptions.find(
    (option) => option.paramName === FilterParamName.latestCreatedYear
  )?.paramValue

  const appliedAllowEmptyCreatedDates = appliedFilters.find(
    (option) => option.paramName === FilterParamName.allowEmptyCreatedDates
  )?.paramValue as boolean
  const selectedAllowEmptyCreatedDates = selectedFilters.find(
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

    selectFiltersAction({
      displayText: earliestCreatedYear.toString(),
      paramValue: earliestCreatedYear,
      paramName: FilterParamName.earliestCreatedYear,
    })

    selectFiltersAction({
      displayText: latestCreatedYear.toString(),
      paramValue: latestCreatedYear,
      paramName: FilterParamName.latestCreatedYear,
    })
  }

  const handleAllowEmptyCreatedDatesPress = () => {
    selectFiltersAction({
      displayText: ALLOW_EMPTY_CREATED_DATES_FILTER.displayText,
      paramValue: !allowEmptyCreatedDates,
      paramName: FilterParamName.allowEmptyCreatedDates,
    })

    setAllowEmptyCreatedDates(!allowEmptyCreatedDates)
  }

  return (
    <Flex flexGrow={1}>
      <ArtworkFilterBackHeader title="Year created" onLeftButtonPress={navigation.goBack} />
      <Flex flexGrow={1} py={2}>
        <Text variant="xs" mb="15px" mx={2}>
          {range(`${sliderValues[0]}`, `${sliderValues[1]}`)}
        </Text>
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
            selectedStyle={{
              backgroundColor: color("blue100"),
            }}
            markerStyle={{
              height: 32,
              width: 32,
              borderRadius: 16,
              backgroundColor: color("mono0"),
              borderColor: color("mono10"),
              borderWidth: 1,
              shadowRadius: 2,
              elevation: 5,
            }}
            pressedMarkerStyle={{
              height: 32,
              width: 32,
              borderRadius: 16,
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
  <TouchableRow onPress={onPress}>
    <Flex flexGrow={1} justifyContent="space-between" flexDirection="row" height={60}>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        flexGrow={1}
        alignItems="center"
        pl={2}
        pr={2}
      >
        <Text variant="xs">{text}</Text>
        {!!selected && (
          <Box>
            <CheckmarkIcon fill="mono100" />
          </Box>
        )}
      </Flex>
    </Flex>
  </TouchableRow>
)
