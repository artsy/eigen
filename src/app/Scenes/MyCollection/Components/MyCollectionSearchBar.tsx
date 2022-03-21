import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { GridViewIcon } from "app/Icons/GridViewIcon"
import { ListViewIcon } from "app/Icons/ListViewIcon"
import SearchIcon from "app/Icons/SearchIcon"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { debounce } from "lodash"
import { Flex, Input, Text } from "palette"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  LayoutAnimation,
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

  const viewOptionPreference = GlobalStore.useAppState((state) => state.userPrefs.artworkViewOption)

  const [viewOption, setViewOption] = useState(viewOptionPreference)

  const inputRef = useRef<TextInput>(null)

  const debouncedSetKeywordFilter = useMemo(() => debounce((text) => onChangeText?.(text), 200), [])

  const onViewOptionChange = (selectedViewOption: ViewOption) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 100,
    })

    setViewOption(selectedViewOption)

    GlobalStore.actions.userPrefs.setArtworkViewOption(selectedViewOption)
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
              <Flex mr={1}>
                <TouchableWithoutFeedback onPress={() => onViewOptionChange("list")}>
                  <Flex width={30} height={30} alignItems="center" justifyContent="center">
                    <ListViewIcon
                      fill={viewOption === "list" ? "black" : "gray"}
                      width={18}
                      height={18}
                    />
                  </Flex>
                </TouchableWithoutFeedback>
              </Flex>
              <TouchableWithoutFeedback onPress={() => onViewOptionChange("grid")}>
                <Flex width={30} height={30} alignItems="center" justifyContent="center">
                  <GridViewIcon
                    fill={viewOption === "grid" ? "black" : "gray"}
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
