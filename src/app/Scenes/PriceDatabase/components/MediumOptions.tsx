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
import { useFormikContext } from "formik"

type MediumOptionsScreenProps = StackScreenProps<
  ArtworkFilterNavigationStack,
  "MediumOptionsScreen"
>

export const MediumOptions: React.FC<MediumOptionsScreenProps> = ({ navigation }) => {
  const { values, setFieldValue } = useFormikContext<PriceDatabaseSearchModel>()

  const selectOption = (option: FilterData) => {
    if (!values.categories.includes(option.paramValue as string)) {
      // Append the paramValue
      setFieldValue("categories", [...values.categories, option.paramValue])
    } else {
      // Remove the paramValue
      setFieldValue(
        "categories",
        values.categories.filter((value) => value !== option.paramValue)
      )
    }
  }

  return (
    <Flex flex={1}>
      <MultiSelectOptionScreen
        onSelect={selectOption}
        filterHeaderText={FilterDisplayName.categories}
        filterOptions={options}
        isSelected={(item) => values.categories.includes(item.paramValue as string)}
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

const options = [
  {
    displayText: "Painting",
    paramValue: "Painting",
    paramName: FilterParamName.categories,
  },
  {
    displayText: "Work on paper",
    paramValue: "Work on Paper",
    paramName: FilterParamName.categories,
  },
  {
    displayText: "Sculpture",
    paramValue: "Sculpture",
    paramName: FilterParamName.categories,
  },
  { displayText: "Print", paramValue: "Print", paramName: FilterParamName.categories },
  {
    displayText: "Photography",
    paramValue: "Photography",
    paramName: FilterParamName.categories,
  },
  {
    displayText: "Textile arts",
    paramValue: "Textile Arts",
    paramName: FilterParamName.categories,
  },
]
