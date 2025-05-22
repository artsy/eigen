import {
  Autocomplete,
  CloseIcon,
  Flex,
  Screen,
  Separator,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import { INPUT_HEIGHT } from "app/Components/Input"
import { SearchInput } from "app/Components/SearchInput"
import { SelectOption } from "app/Components/Select/Select"
import { useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Modal, TouchableOpacity } from "react-native"

export const SelectModal: React.FC<{
  options: Array<SelectOption<unknown>>
  value: unknown | null
  title?: string | undefined
  enableSearch?: boolean
  visible: boolean
  maxHeight?: number
  onDismiss(): any
  onSelectValue(value: unknown, index: number): any
  renderItemLabel?(value: SelectOption<unknown>): JSX.Element
  onModalFinishedClosing?(): void
  testID?: string
}> = ({
  options,
  value,
  title,
  enableSearch,
  visible,
  onDismiss,
  onSelectValue,
  renderItemLabel,
  testID,
}) => {
  const color = useColor()

  // we need to be able to have a local version of the value state so we can show the updated
  // state between the moment the user taps a selection and the moment we automatically
  // close the modal. We don't want to tell the consuming component about the user's selection until the
  // animation is finished, so they don't have to worry about waiting for the animation to finish if they need
  // to trigger further actions as a result.
  const [localValue, setValue] = useState(value)
  useEffect(() => {
    setValue(value)
  }, [value])

  const selectedItem = options.find((o) => o.value === localValue)

  const autocomplete = useMemo(() => {
    return enableSearch
      ? new Autocomplete<SelectOption<unknown>>(
          options.map((option) => {
            if (!option.searchTerms || option.searchTerms.length === 0) {
              console.error("Option with empty search terms: " + JSON.stringify(option))
              return { searchTerms: [], importance: 0, key: option }
            }
            return {
              searchTerms: option.searchTerms,
              importance: option.searchImportance ?? 0,
              key: option,
            }
          })
        )
      : null
  }, [enableSearch, options])

  const [searchTerm, setSearchTerm] = useState("")

  // reset the search term whenever we show the modal
  useEffect(() => {
    if (visible) {
      setSearchTerm("")
    }
  }, [visible])

  const autocompleteResults = useMemo(() => {
    return searchTerm && autocomplete ? autocomplete.getSuggestions(searchTerm) : options
  }, [autocomplete, searchTerm, options])

  const flatListRef = useRef<FlatList>(null)
  const flatListHeight = useRef<number | null>(null)

  // scroll to show the selected value whenever we either clear the
  // search input, or show the modal.
  useEffect(() => {
    if (!visible) {
      return
    }

    if (!searchTerm.trim() && selectedItem) {
      const scrollToSelectedItem = async () => {
        let safety = 0
        // wait for flat list to lay out
        while (flatListHeight.current == null && safety++ < 100) {
          await new Promise((r) => requestAnimationFrame(r))
        }
        // search was cleared (or hasn't been touched yet) and the user has previously selected a value
        const initialScrollIndex = options.indexOf(selectedItem)
        // try to center the option on screen
        const initialScrollOffset =
          initialScrollIndex * INPUT_HEIGHT - (flatListHeight.current ?? 0) / 2 + INPUT_HEIGHT
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToOffset({ offset: initialScrollOffset, animated: false })
        })
      }

      scrollToSelectedItem()
    } else {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false })
      })
    }
  }, [searchTerm, visible])

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      onRequestClose={onDismiss}
      statusBarTranslucent
      testID={testID}
      animationType="slide"
    >
      <Screen>
        <Flex p={2} pb="15px" flexDirection="row" alignItems="center" flexGrow={0}>
          <Flex flex={1} />
          {!!title && (
            <Flex flex={2} alignItems="center">
              <Text>{title}</Text>
            </Flex>
          )}

          <TouchableOpacity
            onPress={onDismiss}
            testID="select-close-button"
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            style={{ flex: 1, alignItems: "flex-end" }}
          >
            <CloseIcon fill="mono60" />
          </TouchableOpacity>
        </Flex>
        {!!enableSearch && (
          <Flex mb={1} mx={2}>
            <SearchInput placeholder="Type to search..." onChangeText={setSearchTerm} />
          </Flex>
        )}

        <Separator />

        <FlatList
          ref={flatListRef}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          data={autocompleteResults}
          extraData={{ value: localValue }}
          keyExtractor={(item) => String(item.value)}
          windowSize={4}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 60 }}
          // we handle scrolling to the selected value ourselves because FlatList has weird
          // rendering bugs when initialScrollIndex changes, at the time of writing
          initialScrollIndex={undefined}
          getItemLayout={(_item, index) => ({
            index,
            length: INPUT_HEIGHT,
            offset: INPUT_HEIGHT * index,
          })}
          style={{ flex: 1 }}
          onLayout={(e) => (flatListHeight.current = e.nativeEvent.layout.height)}
          renderItem={({ item, index }) => {
            const selected = localValue === item.value

            return (
              <Touchable
                onPress={() => {
                  setValue(item.value)
                  onDismiss()
                  onSelectValue(item.value, index)
                }}
                style={{ flexGrow: 0 }}
                testID={`select-option-${item.index}`}
              >
                <Flex
                  flexDirection="row"
                  pl={2}
                  pr="15px"
                  justifyContent="space-between"
                  height={INPUT_HEIGHT}
                  alignItems="center"
                  flexGrow={0}
                >
                  {renderItemLabel?.(item) ?? (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      color={selected ? color("blue100") : color("mono100")}
                      style={{ flexShrink: 1, textDecorationLine: selected ? "underline" : "none" }}
                    >
                      {item.label}
                    </Text>
                  )}
                </Flex>
              </Touchable>
            )
          }}
        />
      </Screen>
    </Modal>
  )
}
