import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { SearchInput } from "lib/Components/SearchInput"
import { isPad } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { Flex, Spacer, useColor } from "palette"
import { ContentTabs } from "palette/elements/Tabs/ContentTabs"
import React, { useState } from "react"
import { Platform, ScrollView } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { AutosuggestResults } from "./AutosuggestResults"
import { CityGuideCTA } from "./CityGuideCTA"
import { RecentSearches } from "./RecentSearches"
import { SearchContext, useSearchProviderValues } from "./SearchContext"

const placeholders = [
  "Search artists, artworks, galleries, etc",
  "Search artists, artworks, etc",
  "Search artworks, etc",
  "Search",
]

export const Search: React.FC = () => {
  const color = useColor()
  const [query, setQuery] = useState("")
  const { trackEvent } = useTracking()
  const searchProviderValues = useSearchProviderValues(query)
  const [active, setActive] = useState("")
  return (
    <SearchContext.Provider value={searchProviderValues}>
      <ArtsyKeyboardAvoidingView>
        <Flex p={2} pb={1} style={{ borderBottomWidth: 1, borderColor: color("black10") }}>
          <SearchInput
            ref={searchProviderValues.inputRef}
            placeholder={placeholders}
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
        {/* <ContentTabs
          setActiveTab={(id) => {
            setActive(id)
          }}
          tabs={[
            { label: "block1", id: "block1" },
            { label: "another", id: "idd" },
            { label: "block2", id: "block2" },
            { label: "another2", id: "idd2" },
            { label: "block3", id: "block3" },
            { label: "another3", id: "idd3" },
            { label: "block4", id: "block4" },
            { label: "another4", id: "idd4" },
            { label: "block5", id: "block5" },
            { label: "block6", id: "block6" },
            { label: "another7", id: "idd7" },
          ]}
          activeTab={active}
        /> */}
        {query.length >= 2 ? (
          <AutosuggestResults query={query} />
        ) : (
          <Scrollable>
            <RecentSearches />
            <Spacer mb={3} />
            {!isPad() && Platform.OS === "ios" ? <CityGuideCTA /> : null}
            <Spacer mb="40px" />
          </Scrollable>
        )}
      </ArtsyKeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

const Scrollable = styled(ScrollView).attrs(() => ({
  keyboardDismissMode: "on-drag",
  keyboardShouldPersistTaps: "handled",
}))`
  flex: 1;
  padding: 0 20px;
  padding-top: 20px;
`
