import { ArtworkFilterContext, useSelectedOptionsDisplay } from "lib/utils/ArtworkFiltersStore"
import React, { useContext } from "react"
import { NavigatorIOS } from "react-native"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface InstitutionOptionsScreenProps {
  navigator: NavigatorIOS
}

export const InstitutionOptionsScreen: React.SFC<InstitutionOptionsScreenProps> = ({ navigator }) => {
  const { dispatch } = useContext(ArtworkFilterContext)

  const filterType = "medium"

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find(option => option.filterType === filterType)?.value! as MediumOption

  const selectOption = (option: MediumOption) => {
    dispatch({ type: "selectFilters", payload: { value: option, filterType } })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterText="Medium"
      filterOptions={OrderedMediumFilters}
      selectedOption={selectedOption}
      navigator={navigator}
    />
  )
}
