import { color, Flex, Serif, Spacer, Theme } from "@artsy/palette"
import { Input } from "lib/Components/Input/Input"
import { SearchInput } from "lib/Components/SearchInput"
import { isPad } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef, useState } from "react"
import { KeyboardAvoidingView, NativeModules, ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { AutosuggestResults } from "./AutosuggestResults"
import { CityGuideCTA } from "./CityGuideCTA"
import { ProvideRecentSearches, RecentSearches, useRecentSearches } from "./RecentSearches"
import { SearchContext } from "./SearchContext"

const SearchPage: React.FC = () => {
  const input = useRef<Input>(null)
  const [query, setQuery] = useState("")
  const queryRef = useRef(query)
  queryRef.current = query
  const { recentSearches } = useRecentSearches()
  const { trackEvent } = useTracking()

  const showCityGuide = NativeModules.Emission.options.AROptionsEnableSales && !isPad()
  return (
    <SearchContext.Provider value={{ inputRef: input, query: queryRef }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <Flex p={2} pb={1} style={{ borderBottomWidth: 1, borderColor: color("black10") }}>
          <SearchInput
            ref={input}
            placeholder="Search artists, artworks, galleries, etc"
            enableCancelButton
            onChangeText={queryText => {
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
        ) : showCityGuide ? (
          <Scrollable>
            <RecentSearches />
            <Spacer mb={3} />
            <CityGuideCTA />
            <Spacer mb="40px" />
          </Scrollable>
        ) : recentSearches.length ? (
          <Scrollable>
            <RecentSearches />
            <Spacer mb="40px" />
          </Scrollable>
        ) : (
          <LegacyEmptyState />
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

const LegacyEmptyState: React.FC<{}> = ({}) => {
  return (
    <Flex style={{ flex: 1 }} alignItems="center" justifyContent="center">
      <Flex maxWidth={250}>
        <Serif textAlign="center" size="3">
          Search for artists, artworks, galleries, shows, and more.
        </Serif>
      </Flex>
    </Flex>
  )
}

export const Search: React.FC = () => {
  return (
    <Theme>
      <ProvideScreenDimensions>
        <ProvideRecentSearches>
          <SearchPage />
        </ProvideRecentSearches>
      </ProvideScreenDimensions>
    </Theme>
  )
}
