import { SearchInput } from "lib/Components/SearchInput"
import { isPad } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { color, Flex, Spacer } from "palette"
import React, { useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { AutosuggestResults } from "./AutosuggestResults"
import { CityGuideCTA } from "./CityGuideCTA"
import { RecentSearches } from "./RecentSearches"
import { SearchContext, useSearchProviderValues } from "./SearchContext"

export const Search: React.FC = () => {
  const [query, setQuery] = useState("")
  const { trackEvent } = useTracking()
  const searchProviderValues = useSearchProviderValues(query)

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <Flex p="2" pb="1" style={{ borderBottomWidth: 1, borderColor: color("black10") }}>
          <SearchInput
            ref={searchProviderValues.inputRef}
            placeholder="Search artists, artworks, galleries, etc"
            enableCancelButton
            onChangeText={(queryText) => {
              queryText = queryText.trim()
              setQuery(queryText)
              trackEvent({
                action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
                query: queryText,
              })
            }}
            onFocus={() => {
              trackEvent({
                action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
                query,
              })
            }}
            onClear={() => {
              trackEvent({
                action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
              })
            }}
          />
        </Flex>
        {query.length >= 2 ? (
          <AutosuggestResults query={query} />
        ) : (
          <Scrollable>
            <RecentSearches />
            <Spacer mb="3" />
            {!isPad() && Platform.OS === "ios" && <CityGuideCTA />}
            <Spacer mb={40} />
          </Scrollable>
        )}
      </KeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

const Scrollable = styled(ScrollView).attrs({
  keyboardDismissMode: "on-drag",
  keyboardShouldPersistTaps: "handled",
})`
  flex: 1;
  padding: 0 20px;
  padding-top: 20px;
`
