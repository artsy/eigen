import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Input } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import { debounce } from "lodash"
import React, { useEffect, useMemo } from "react"

export const KeywordFilter: React.FC = () => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)
  const applyFiltersAction = ArtworksFiltersStore.useStoreActions((action) => action.applyFiltersAction)

  const updateKeywordFilter = (text: string) => {
    selectFiltersAction({
      displayText: text,
      paramValue: text,
      paramName: FilterParamName.keyword,
    })
    applyFiltersAction()
  }

  const handleChangeText = useMemo(() => debounce(updateKeywordFilter, 200), [])

  // Stop the invocation of the debounce function after unmounting
  useEffect(() => {
    return () => {
      handleChangeText.cancel()
    }
  }, [])

  return (
    <Input
      icon={<SearchIcon width={18} height={18} />}
      defaultValue=""
      placeholder="Search by artwork title, series, or description"
      onChangeText={handleChangeText}
      autoFocus={typeof jest === "undefined"}
      autoCorrect={false}
      enableClearButton={true}
    />
  )
}
