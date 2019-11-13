import { color, Flex, Sans, space } from "@artsy/palette"
import SearchIcon from "lib/Icons/SearchIcon"
import React, { useRef, useState } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { AutocompleteResults } from "./AutocompleteResults"
import { Input } from "./Input"

export const Search: React.FC = () => {
  const input = useRef<Input>()
  const [query, setQuery] = useState("")
  return (
    <Flex>
      <Flex
        flexDirection="row"
        alignItems="center"
        style={{ borderBottomWidth: 1, borderColor: color("black10"), padding: space(2), paddingBottom: space(1) }}
      >
        <Input ref={input} placeholder="Search Artsy" icon={<SearchIcon />} onChangeText={setQuery} />
        <TouchableWithoutFeedback
          onPress={() => {
            input.current.clear()
            input.current.blur()
            setQuery("")
          }}
        >
          <Flex style={{ paddingLeft: space(1) }}>
            <Sans size="2" color={color("black60")}>
              Cancel
            </Sans>
          </Flex>
        </TouchableWithoutFeedback>
      </Flex>
      <AutocompleteResults query={query} />
    </Flex>
  )
}
