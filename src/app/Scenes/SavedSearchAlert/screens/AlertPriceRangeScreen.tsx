import { Button, Flex, Input, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { PriceRange, parsePriceRange } from "app/Components/ArtworkFilter/Filters/helpers"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { ArtworkFilterBackHeader } from "app/Components/ArtworkFilter/components/ArtworkFilterBackHeader"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useRef, useState } from "react"
import { ScrollView, TextInput } from "react-native"

const DEFAULT_PRICE_RANGE = "*-*"
const NUMBERS_REGEX = /^(|\d)+$/

const getInputValue = (value: PriceRange[number]) => {
  return value === "*" || value === 0 ? "" : value.toString()
}

export const AlertPriceRangeScreen = () => {
  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "AlertPriceRange">>()
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const setValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.setValueToAttributesByKeyAction
  )

  const minValInputRef = useRef<TextInput>(null)
  const maxValInputRef = useRef<TextInput>(null)

  const initailPriceRange = attributes.priceRange || DEFAULT_PRICE_RANGE

  const [range, setRange] = useState(parsePriceRange(initailPriceRange))
  const [minValue, maxValue] = range

  const handleTextChange = (changedIndex: number) => (value: string) => {
    // Early exit the input update if the value is not a number
    // This was added for the android number-pad keyboard that
    // includes some special characters
    if (!NUMBERS_REGEX.test(value)) {
      return
    }

    const updatedRange = range.map((rangeValue, index) => {
      if (index === changedIndex) {
        if (value === "" || value === "0") {
          return "*"
        }

        return parseInt(value, 10)
      }

      return rangeValue
    })

    setRange(updatedRange)
  }

  const handleOnButtonPress = () => {
    setValueToAttributesByKeyAction({
      key: SearchCriteria.priceRange,
      value: range.join("-"),
    })
    navigation.goBack()
  }

  const handleOnClear = () => {
    if (minValInputRef.current && maxValInputRef.current) {
      minValInputRef.current.clear()
      maxValInputRef.current.clear()
    }
    setRange(parsePriceRange(DEFAULT_PRICE_RANGE))
  }

  return (
    <Flex>
      <ArtworkFilterBackHeader
        title="Price"
        onLeftButtonPress={() => navigation.goBack()}
        rightButtonText="Clear"
        onRightButtonPress={handleOnClear}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Flex m={2}>
          <Text variant="sm">Set price range you are interested in</Text>
        </Flex>
        <Flex flexDirection="row" mx={2}>
          <Input
            ref={minValInputRef}
            containerStyle={{ flex: 1 }}
            description="Min"
            fixedRightPlaceholder="$USD"
            enableClearButton
            keyboardType="number-pad"
            value={getInputValue(minValue)}
            onChangeText={handleTextChange(0)}
            testID="price-min-input"
            descriptionColor="black100"
            accessibilityLabel="Minimum Price Range Input"
          />
          <Spacer x={2} />
          <Input
            ref={maxValInputRef}
            containerStyle={{ flex: 1 }}
            description="Max"
            fixedRightPlaceholder="$USD"
            enableClearButton
            keyboardType="number-pad"
            value={getInputValue(maxValue)}
            onChangeText={handleTextChange(1)}
            testID="price-max-input"
            descriptionColor="black100"
            accessibilityLabel="Maximum Price Range Input"
          />
        </Flex>
      </ScrollView>
      <Spacer y={2} />
      <Flex m={2}>
        <Button block onPress={handleOnButtonPress}>
          Set Price Range
        </Button>
      </Flex>
    </Flex>
  )
}
