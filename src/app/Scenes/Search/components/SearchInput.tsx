import { useNavigation } from "@react-navigation/native"
import { SearchInput as SearchBox } from "app/Components/SearchInput"
import { useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { SEARCH_THROTTLE_INTERVAL } from "app/Scenes/Search/constants"
import { useSafeTimeout } from "app/utils/hooks/useSafeTimeout"
import { Schema } from "app/utils/track"
import { throttle } from "lodash"
import { useEffect, useMemo } from "react"
import { Platform } from "react-native"
import { useTracking } from "react-tracking"

export interface SearchInputProps {
  placeholder: string
  currentRefinement: string
  refine: (value: string) => any
  onTextChange: (value: string) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({
  currentRefinement,
  placeholder,
  refine,
  onTextChange,
}) => {
  const { trackEvent } = useTracking()
  const searchProviderValues = useSearchProviderValues(currentRefinement)
  const isAndroid = Platform.OS === "android"
  const navigation = useNavigation()
  const setSafeTimeout = useSafeTimeout()
  const handleChangeText = useMemo(
    () =>
      throttle((value) => {
        refine(value)
        onTextChange(value)
      }, SEARCH_THROTTLE_INTERVAL),
    [onTextChange]
  )

  useEffect(() => {
    if (searchProviderValues.inputRef?.current && isAndroid) {
      const unsubscribe = navigation?.addListener("focus", () => {
        // setSafeTimeout here is to make sure that the search screen is focused in order to focus on text input
        // without that the searchInput is not focused
        setSafeTimeout(() => searchProviderValues.inputRef.current?.focus(), 200)
      })

      return unsubscribe
    }
  }, [navigation, searchProviderValues.inputRef.current, setSafeTimeout])

  return (
    <SearchBox
      ref={searchProviderValues.inputRef}
      placeholder={placeholder}
      onChangeText={(text) => {
        handleChangeText(text)

        if (text.length === 0) {
          trackEvent({
            action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
          })

          handleChangeText.flush()
          return
        }

        trackEvent({
          action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
          query: text,
        })
      }}
    />
  )
}
