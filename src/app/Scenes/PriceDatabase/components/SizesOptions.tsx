import { Flex } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { MultiSelectOptionScreen } from "app/Components/ArtworkFilter/Filters/MultiSelectOption"
import { ArtworkFilterApplyButton } from "app/Components/ArtworkFilter/components/ArtworkFilterApplyButton"
import { PriceDatabaseSearchModel } from "app/Scenes/PriceDatabase/validation"
import { GlobalStore } from "app/store/GlobalStore"
import { useFormikContext } from "formik"

type OptionsScreenProps = StackScreenProps<ArtworkFilterNavigationStack, "SizesOptionsScreen">

export const SizesOptions: React.FC<OptionsScreenProps> = ({ navigation }) => {
  const preferredMetric = GlobalStore.useAppState((state) => state.userPrefs.metric)

  const options = preferredMetric === "in" ? sizesInInches : sizesInCm

  const { values, setFieldValue } = useFormikContext<PriceDatabaseSearchModel>()

  const selectOption = (option: FilterData) => {
    if (!values.sizes.includes(option.paramValue as string)) {
      // Append the paramValue
      setFieldValue("sizes", [...values.sizes, option.paramValue])
    } else {
      // Remove the paramValue
      setFieldValue(
        "sizes",
        values.sizes.filter((value) => value !== option.paramValue)
      )
    }
  }

  return (
    <Flex flex={1}>
      <MultiSelectOptionScreen
        onSelect={selectOption}
        filterHeaderText={FilterDisplayName.sizes}
        filterOptions={options}
        isSelected={(item) => values.sizes.includes(item.paramValue as string)}
        navigation={navigation}
      />

      <ArtworkFilterApplyButton
        disabled={false}
        onPress={navigation.goBack}
        buttonText="Apply"
        pb={2}
      />
    </Flex>
  )
}

export const sizesInCm = [
  { displayText: "Small (under 40cm)", paramValue: "SMALL", paramName: FilterParamName.sizes },
  { displayText: "Medium (40 – 100cm)", paramValue: "MEDIUM", paramName: FilterParamName.sizes },
  { displayText: "Large (over 100cm)", paramValue: "LARGE", paramName: FilterParamName.sizes },
]

export const sizesInInches = [
  { displayText: "Small (under 16in)", paramValue: "SMALL", paramName: FilterParamName.sizes },
  { displayText: "Medium (16 – 40in)", paramValue: "MEDIUM", paramName: FilterParamName.sizes },
  { displayText: "Large (over 40in)", paramValue: "LARGE", paramName: FilterParamName.sizes },
]
