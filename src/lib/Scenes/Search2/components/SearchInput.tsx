import { useNavigation } from "@react-navigation/native"
import { SearchInput as SearchBox } from "lib/Components/SearchInput"
import { useSearchProviderValues } from "lib/Scenes/Search/SearchContext"
import { Schema } from "lib/utils/track"
import { throttle } from "lodash"
import React, { useEffect, useMemo } from "react"
import { Platform } from "react-native"
import { useTracking } from "react-tracking"

export interface SearchInputProps {
  placeholder: string
  currentRefinement: string
  refine: (value: string) => any
  onReset: () => void
  onTextChange: (value: string) => void
}

const SEARCH_THROTTLE_INTERVAL = 500

export const SearchInput: React.FC<SearchInputProps> = ({
  currentRefinement,
  placeholder,
  refine,
  onTextChange,
  onReset,
}) => {
  const { trackEvent } = useTracking()
  const searchProviderValues = useSearchProviderValues(currentRefinement)
  const isAndroid = Platform.OS === "android"
  const navigation = isAndroid ? useNavigation() : null
  const handleChangeText = useMemo(
    () =>
      throttle((value) => {
        refine(value)
        onTextChange(value)
      }, SEARCH_THROTTLE_INTERVAL),
    []
  )

  const handleReset = () => {
    trackEvent({
      action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
    })

    refine("")
    handleChangeText.cancel()
    onReset()
  }

  useEffect(() => {
    if (searchProviderValues.inputRef?.current && isAndroid) {
      const unsubscribe = navigation?.addListener("focus", () => {
        // setTimeout here is to make sure that the search screen is focused in order to focus on text input
        // without that the searchInput is not focused
        setTimeout(() => searchProviderValues.inputRef.current?.focus(), 200)
      })

      return unsubscribe
    }
  }, [navigation, searchProviderValues.inputRef.current])

  return (
    <SearchBox
      ref={searchProviderValues.inputRef}
      enableCancelButton
      placeholder={placeholder}
      onChangeText={(text) => {
        trackEvent({
          action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
          query: text,
        })

        handleChangeText(text)
        onReset()
      }}
      onClear={handleReset}
    />
  )
}
