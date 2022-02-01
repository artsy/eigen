import { useStickyTabPageContext } from "lib/Components/StickyTabPage/SitckyTabPageContext"
import SearchIcon from "lib/Icons/SearchIcon"
import { debounce } from "lodash"
import { Flex, Input, Text } from "palette"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TouchableWithoutFeedback,
} from "react-native"

interface MyCollectionSearchBarProps {
  onChangeText: ((text: string) => void) | undefined
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
}

export const MyCollectionSearchBar: React.FC<MyCollectionSearchBarProps> = ({
  onChangeText,
  onFocus,
}) => {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const { hideStaticHeader, showStaticHeader } = useStickyTabPageContext()

  const inputRef = useRef<TextInput>(null)

  const debouncedSetKeywordFilter = useMemo(() => debounce((text) => onChangeText?.(text), 200), [])

  useEffect(() => {
    debouncedSetKeywordFilter(value)
  }, [value])

  useEffect(() => {
    isFocused ? hideStaticHeader() : showStaticHeader()
  }, [isFocused])

  return (
    <Flex my={0.5} mx={2}>
      {isFocused ? (
        <Flex>
          <Input
            placeholder="Search by Artist, Artwork or Keyword"
            onChangeText={setValue}
            onFocus={onFocus}
            onBlur={() => setIsFocused(false)}
            enableClearButton
            ref={inputRef}
            value={value}
            selectTextOnFocus
            returnKeyType="done"
          />
        </Flex>
      ) : (
        <Flex>
          <TouchableWithoutFeedback
            onPress={() => {
              setIsFocused(true)
              requestAnimationFrame(() => inputRef.current?.focus())
            }}
          >
            <Flex flexDirection="row" my={1} py={0.5}>
              <SearchIcon width={18} height={18} />
              <Text ml={1}>{value.length > 0 ? value : "Search Your Collection"}</Text>
            </Flex>
          </TouchableWithoutFeedback>
        </Flex>
      )}
    </Flex>
  )
}
