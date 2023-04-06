import { Flex, useTheme, Text } from "@artsy/palette-mobile"
import { GridViewIcon } from "app/Components/Icons/GridViewIcon"
import { ListViewIcon } from "app/Components/Icons/ListViewIcon"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { useStickyTabPageContext } from "app/Components/StickyTabPage/StickyTabPageContext"
import { useAnimatedValue } from "app/Components/StickyTabPage/reanimatedHelpers"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { debounce } from "lodash"
import { Input } from "@artsy/palette-mobile"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  LayoutAnimation,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native"
import Animated from "react-native-reanimated"

export interface MyCollectionSearchBarProps {
  onChangeText: ((text: string) => void) | undefined
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
  searchString: string
  onIsFocused?: (isFocused: boolean) => void
}

export const MyCollectionSearchBar: React.FC<MyCollectionSearchBarProps> = ({
  onChangeText,
  onFocus,
  searchString = "",
  onIsFocused,
}) => {
  const { space } = useTheme()

  const [isFocused, setIsFocused] = useState(false)

  const hasRunFocusedAnimation = useAnimatedValue(1)

  const [value, setValue] = useState(searchString)

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
        ([, hasFinishedAnimationLoop]) => {
          if (hasFinishedAnimationLoop) {
            return
          }
          hasRunFocusedAnimation.setValue(new Animated.Value(1))
        }
      ),
    [isFocused]
  )

  useEffect(() => {
    debouncedSetKeywordFilter(value)
  }, [value])

  return (
    <Flex>
      {isFocused ? (
        <Flex flexDirection="row" alignItems="center">
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
            autoCorrect={false}
          />

          <TouchableOpacity
            testID="MyCollectionSearchBarInputCancelButton"
            onPress={() => {
              setValue("")
              hasRunFocusedAnimation.setValue(new Animated.Value(0))

              LayoutAnimation.configureNext({
                ...LayoutAnimation.Presets.easeInEaseOut,
                duration: 100,
              })

              onIsFocused?.(false)
              setIsFocused(false)
            }}
            hitSlop={{ bottom: 40, right: 40, left: 0, top: 40 }}
          >
            <Text ml={1} color="black60" variant="xs">
              Cancel
            </Text>
          </TouchableOpacity>
        </Flex>
      ) : (
        <Flex my={1}>
          <Flex flexDirection="row" justifyContent="space-between">
            <Flex flex={1} mr={1} justifyContent="center">
              <TouchableWithoutFeedback
                testID="MyCollectionSearchBarNoInputTouchable"
                onPress={() => {
                  hasRunFocusedAnimation.setValue(new Animated.Value(0))
                  setIsFocused(true)
                  onIsFocused?.(true)

                  LayoutAnimation.configureNext({
                    ...LayoutAnimation.Presets.easeInEaseOut,
                    duration: 100,
                  })

                  requestAnimationFrame(() => inputRef.current?.focus())
                }}
                hitSlop={{
                  top: space(1),
                  bottom: space(1),
                  left: space(1),
                  right: space(1),
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
                  hitSlop={{
                    top: space(1),
                    bottom: space(1),
                    left: space(1),
                    right: space(1),
                  }}
                >
                  <Flex width={30} height={30} alignItems="center" justifyContent="center">
                    <ListViewIcon
                      color={viewOption === "list" ? "black100" : "black30"}
                      width={18}
                      height={18}
                    />
                  </Flex>
                </TouchableWithoutFeedback>
              </Flex>
              <TouchableWithoutFeedback
                testID="MyCollectionSearchGridIconTouchable"
                onPress={() => onViewOptionChange("grid")}
                hitSlop={{
                  top: space(1),
                  bottom: space(1),
                  left: space(1),
                  right: space(1),
                }}
              >
                <Flex width={30} height={30} alignItems="center" justifyContent="center">
                  <GridViewIcon
                    color={viewOption === "grid" ? "black100" : "black30"}
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
