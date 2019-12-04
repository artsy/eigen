import { color, Flex, Sans, Serif, space, Theme } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import React, { useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { AutosuggestResults } from "./AutosuggestResults"
import { Input } from "./Input"
import { RecentSearches, useRecentSearches } from "./RecentSearches"

export const Search: React.FC = () => {
  const input = useRef<Input>()
  const [query, setQuery] = useState("")
  const { recentSearches } = useRecentSearches()
  return (
    <Theme>
      <Flex flexGrow={1}>
        <Flex
          flexDirection="row"
          alignItems="center"
          p={2}
          pb={1}
          pr={0}
          style={{ borderBottomWidth: 1, borderColor: color("black10") }}
        >
          <Input
            ref={input}
            placeholder="Search Artsy"
            icon={<SearchIcon />}
            onChangeText={q => setQuery(q.trim())}
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {
              input.current.clear()
              input.current.blur()
              setQuery("")
            }}
            hitSlop={{ bottom: 20, right: 20, left: 20, top: 20 }}
          >
            <Flex pl={1} pr={2}>
              <Sans size="2" color={query ? "black60" : "black30"}>
                Clear
              </Sans>
            </Flex>
          </TouchableOpacity>
        </Flex>
        <View style={{ flex: 1, padding: space(2) }} onTouchStart={() => input.current.blur()}>
          {query ? <AutosuggestResults query={query} /> : recentSearches.length ? <RecentSearches /> : <EmptyState />}
        </View>
      </Flex>
    </Theme>
  )
}

const EmptyState: React.FC<{}> = ({}) => {
  return (
    <Flex flexGrow={1} alignItems="center" justifyContent="center">
      <Flex maxWidth={250}>
        <Serif textAlign="center" size="3">
          Search for artists, artworks, galleries, shows, and more.
        </Serif>
      </Flex>
    </Flex>
  )
}
