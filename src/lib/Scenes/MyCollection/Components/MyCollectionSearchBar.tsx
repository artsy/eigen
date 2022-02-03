import { useStickyTabPageContext } from "lib/Components/StickyTabPage/SitckyTabPageContext"
import SearchIcon from "lib/Icons/SearchIcon"
import { ViewOption } from "lib/Scenes/Search/UserPreferencesModel"
import { GlobalStore } from "lib/store/GlobalStore"
import { debounce } from "lodash"
import { AddIcon, Flex, Input, MenuIcon, Text } from "palette"
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

  const viewOption = GlobalStore.useAppState((state) => state.userPreferences.artworkViewOption)

  const inputRef = useRef<TextInput>(null)

  const debouncedSetKeywordFilter = useMemo(() => debounce((text) => onChangeText?.(text), 200), [])

  const onViewOptionChange = (selectedViewOption: ViewOption) => {
    GlobalStore.actions.userPreferences.setArtworkViewOption(selectedViewOption)
  }

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
          <Flex flexDirection="row" my={1} py={0.5} justifyContent="space-between">
            <Flex>
              <TouchableWithoutFeedback
                onPress={() => {
                  setIsFocused(true)
                  requestAnimationFrame(() => inputRef.current?.focus())
                }}
              >
                <Flex flexDirection="row" alignItems="center">
                  <SearchIcon width={18} height={18} />
                  <Text ml={1}>{value.length > 0 ? value : "Search Your Collection"}</Text>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
            <Flex flexDirection="row">
              <TouchableWithoutFeedback onPress={() => onViewOptionChange("list")}>
                <Flex width={30} height={30} alignItems="center" justifyContent="center">
                  <MenuIcon
                    fill={viewOption === "list" ? "black100" : "black30"}
                    width={18}
                    height={18}
                  />
                </Flex>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => onViewOptionChange("grid")}>
                <Flex width={30} height={30} alignItems="center" justifyContent="center">
                  <AddIcon
                    fill={viewOption === "grid" ? "black100" : "black30"}
                    width={18}
                    height={18}
                  />
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
