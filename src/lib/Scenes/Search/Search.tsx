import { color, Flex, Sans, Theme } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import React, { useRef, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { AutocompleteResults } from "./AutocompleteResults"
import { Input } from "./Input"

export const Search: React.FC = () => {
  const input = useRef<Input>()
  const [query, setQuery] = useState("")
  return (
    <Theme>
      <Flex>
        <Flex
          flexDirection="row"
          alignItems="center"
          p={2}
          pb={1}
          style={{ borderBottomWidth: 1, borderColor: color("black10") }}
        >
          <Input
            ref={input}
            placeholder="Search Artsy"
            icon={<SearchIcon />}
            onChangeText={q => setQuery(q.trim())}
            autoCorrect={false}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              input.current.clear()
              input.current.blur()
              setQuery("")
            }}
          >
            <Flex pl={1}>
              <Sans size="2" color="black60">
                Cancel
              </Sans>
            </Flex>
          </TouchableWithoutFeedback>
        </Flex>
        <AutocompleteResults query={query} />
      </Flex>
    </Theme>
  )
}
