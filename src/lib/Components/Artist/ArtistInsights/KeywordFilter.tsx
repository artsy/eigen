import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Input } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import React from "react"

export const KeywordFilter: React.FC = () => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)
  const applyFiltersAction = ArtworksFiltersStore.useStoreActions((action) => action.applyFiltersAction)

  const handleKeywordChange = (text: string) => {
    selectFiltersAction({
      displayText: text,
      paramValue: text,
      paramName: FilterParamName.keyword,
    })
    applyFiltersAction()
  }

  return (
    <Input
      icon={<SearchIcon width={18} height={18} />}
      defaultValue={""}
      onChangeText={handleKeywordChange}
      autoFocus={typeof jest === "undefined"}
      autoCorrect={false}
      enableClearButton={true}
    />
  )
}
