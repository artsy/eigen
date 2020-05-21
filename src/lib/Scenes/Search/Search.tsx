import { color, Flex, Sans, Serif, Theme } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import { isPad } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { ProvideScreenDimensions, useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef, useState } from "react"
import { KeyboardAvoidingView, LayoutAnimation, NativeModules, ScrollView, TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"
import { AutosuggestResults } from "./AutosuggestResults"
import { CityGuideCTA } from "./CityGuideCTA"
import { Input } from "./Input"
import { ProvideRecentSearches, RecentSearches, useRecentSearches } from "./RecentSearches"
import { SearchContext } from "./SearchContext"

const SHOW_CITY_GUIDE = NativeModules.Emission.options.AROptionsMoveCityGuideEnableSales && !isPad()

const SearchPage: React.FC = () => {
  const input = useRef<Input>(null)
  const [query, setQuery] = useState("")
  const queryRef = useRef(query)
  queryRef.current = query
  const { recentSearches } = useRecentSearches()
  const [inputFocused, setInputFocused] = useState(false)
  const {
    safeAreaInsets: { top },
  } = useScreenDimensions()
  const { trackEvent } = useTracking()
  return (
    <SearchContext.Provider value={{ inputRef: input, query: queryRef }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={top} enabled>
        <Flex flexDirection="row" p={2} pb={1} style={{ borderBottomWidth: 1, borderColor: color("black10") }}>
          <Input
            ref={input}
            placeholder="Search artists, artworks, galleries, etc"
            icon={<SearchIcon />}
            onChangeText={queryText => {
              queryText = queryText.trim()
              setQuery(queryText)
              trackEvent({
                action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
                query: queryText,
              })
            }}
            autoCorrect={false}
            onFocus={() => {
              LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 180 })
              setInputFocused(true)
              trackEvent({
                action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
                query,
              })
            }}
            onBlur={() => {
              LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 180 })
              setInputFocused(false)
            }}
            showClearButton
            onClear={() => {
              trackEvent({
                action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
              })
            }}
            returnKeyType="search"
          />
          <Flex alignItems="center" justifyContent="center" flexDirection="row">
            {inputFocused && (
              <TouchableOpacity
                onPress={() => {
                  input.current?.blur()
                }}
                hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
              >
                <Flex pl={1}>
                  <Sans size="2" color="black60">
                    Cancel
                  </Sans>
                </Flex>
              </TouchableOpacity>
            )}
          </Flex>
        </Flex>

        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
          {query.length >= 2 ? (
            <AutosuggestResults query={query} />
          ) : SHOW_CITY_GUIDE ? (
            <>
              <RecentSearches />
              <CityGuideCTA />
            </>
          ) : recentSearches.length ? (
            <Flex px={2}>
              <RecentSearches />
            </Flex>
          ) : (
            <LegacyEmptyState />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

const LegacyEmptyState: React.FC<{}> = ({}) => {
  return (
    <Flex p={2} style={{ flex: 1 }} alignItems="center" justifyContent="center">
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
