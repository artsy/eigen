import { color, Flex, Sans, Serif, Theme } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import { ProvideScreenDimensions, useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef, useState } from "react"
import { KeyboardAvoidingView, LayoutAnimation, TouchableOpacity, View } from "react-native"
import { AutosuggestResults } from "./AutosuggestResults"
import { Input } from "./Input"
import { ProvideRecentSearches, RecentSearches, useRecentSearches } from "./RecentSearches"
import { SearchContext } from "./SearchContext"

const SearchPage: React.FC = () => {
  const input = useRef<Input>()
  const [query, setQuery] = useState("")
  const { recentSearches } = useRecentSearches()
  const [inputFocused, setInputFocused] = useState(false)
  const {
    safeAreaInsets: { top },
  } = useScreenDimensions()
  return (
    <SearchContext.Provider value={{ inputRef: input }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={top} enabled>
        <Flex flexDirection="row" p={2} pb={1} style={{ borderBottomWidth: 1, borderColor: color("black10") }}>
          <Input
            ref={input}
            placeholder="Search Artsy"
            icon={<SearchIcon />}
            onChangeText={q => setQuery(q.trim())}
            autoCorrect={false}
            onFocus={() => {
              LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 180 })
              setInputFocused(true)
            }}
            onBlur={() => {
              LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.easeInEaseOut, duration: 180 })
              setInputFocused(false)
            }}
            showClearButton
            returnKeyType="search"
          />
          <Flex alignItems="center" justifyContent="center" flexDirection="row">
            {inputFocused && (
              <TouchableOpacity
                onPress={() => {
                  input.current.blur()
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
        <View style={{ flex: 1 }}>
          {query.length >= 2 ? (
            <AutosuggestResults query={query} />
          ) : recentSearches.length ? (
            <RecentSearches />
          ) : (
            <EmptyState />
          )}
        </View>
      </KeyboardAvoidingView>
    </SearchContext.Provider>
  )
}

const EmptyState: React.FC<{}> = ({}) => {
  return (
    <Flex p={2} flexGrow={1} alignItems="center" justifyContent="center">
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
