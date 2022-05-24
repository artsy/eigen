import { useAnimatedValue } from "app/Components/StickyTabPage/reanimatedHelpers"
import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { GridViewIcon } from "app/Icons/GridViewIcon"
import { ListViewIcon } from "app/Icons/ListViewIcon"
import SearchIcon from "app/Icons/SearchIcon"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { debounce } from "lodash"
import { Flex, Input, Text } from "palette"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  FlatList,
  LayoutAnimation,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TouchableWithoutFeedback,
} from "react-native"
import Animated from "react-native-reanimated"

export interface MyCollectionSearchBarProps {
  onChangeText: ((text: string) => void) | undefined
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  innerFlatListRef?: React.MutableRefObject<{ getNode(): FlatList<any> } | null>
  searchString: string
  onIsFocused?: (isFocused: boolean) => void
}

export const MyCollectionSearchBar: React.FC<MyCollectionSearchBarProps> = ({
  onChangeText,
  onFocus,
  innerFlatListRef,
  searchString = "",
  onIsFocused,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const hasRunFocusedAnimation = useAnimatedValue(1)

  const [value, setValue] = useState(searchString)

  const enabledSearchBar = useFeatureFlag("AREnableMyCollectionSearchBar")

  const { staticHeaderHeight } = useStickyTabPageContext()

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

  Animated.useCode(
    () =>
      Animated.call(
        [staticHeaderHeight, hasRunFocusedAnimation],
        ([staticHeaderHeightValue, hasFinishedAnimationLoop]) => {
          if (hasFinishedAnimationLoop) {
            return
          }
          innerFlatListRef?.current
            ?.getNode()
            .scrollToOffset({ offset: Number(staticHeaderHeightValue), animated: true })
          hasRunFocusedAnimation.setValue(new Animated.Value(1))
        }
      ),
    [isFocused]
  )

  useEffect(() => {
    debouncedSetKeywordFilter(value)
  }, [value])

  if (!enabledSearchBar) {
    return null
  }

  return (
    <Flex my={1}>
      {isFocused ? (
        <Flex flexDirection="row" alignItems="center" my={0.5}>
          <Input
            testID="MyCollectionSearchBarInput"
            placeholder="Search by Artist, Artwork or Keyword"
            onChangeText={setValue}
            onFocus={onFocus}
            onBlur={() => {
              hasRunFocusedAnimation.setValue(new Animated.Value(0))
              onIsFocused?.(false)
              setIsFocused(false)
            }}
            enableClearButton
            ref={inputRef}
            value={value}
            returnKeyType="done"
            fontSize={14}
          />

          <TouchableWithoutFeedback
            testID="MyCollectionSearchBarInputCancelButton"
            onPress={() => {
              setValue("")
              hasRunFocusedAnimation.setValue(new Animated.Value(0))
              onIsFocused?.(false)
              setIsFocused(false)
            }}
          >
            <Text ml={1} color="black60" variant="xs">
              Cancel
            </Text>
          </TouchableWithoutFeedback>
        </Flex>
      ) : (
        <Flex>
          <Flex flexDirection="row" my={1} py={0.5} justifyContent="space-between">
            <Flex flex={1} mr={1} justifyContent="center">
              <TouchableWithoutFeedback
                testID="MyCollectionSearchBarNoInputTouchable"
                onPress={() => {
                  hasRunFocusedAnimation.setValue(new Animated.Value(0))
                  setIsFocused(true)
                  onIsFocused?.(true)
                  requestAnimationFrame(() => inputRef.current?.focus())
                }}
              >
                <Flex flexDirection="row" width="100%">
                  <SearchIcon width={18} height={18} />
                  <Text ml={1} variant="xs">
                    {value.length > 0 ? value : "Search Your Collection"}
                  </Text>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
            <Flex flexDirection="row">
              <Flex mr={1}>
                <TouchableWithoutFeedback
                  testID="MyCollectionSearchListIconTouchable"
                  onPress={() => onViewOptionChange("list")}
                >
                  <Flex width={30} height={30} alignItems="center" justifyContent="center">
                    <ListViewIcon
                      fill={viewOption === "list" ? "black" : "gray"}
                      width={18}
                      height={18}
                    />
                  </Flex>
                </TouchableWithoutFeedback>
              </Flex>
              <TouchableWithoutFeedback
                testID="MyCollectionSearchGridIconTouchable"
                onPress={() => onViewOptionChange("grid")}
              >
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
