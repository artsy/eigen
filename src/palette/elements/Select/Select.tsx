import { TriangleDown } from "app/Icons/TriangleDown"
import { Autocomplete } from "app/utils/Autocomplete"
import {
  CloseIcon,
  Flex,
  Separator,
  Text,
  Touchable,
  useColor,
  useTextStyleForPalette,
} from "palette"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { FlatList, TextInput, TouchableOpacity } from "react-native"
import { FancyModal } from "../../../app/Components/FancyModal/FancyModal"
import { SearchInput } from "../../../app/Components/SearchInput"
import { INPUT_HEIGHT, InputTitle } from "../Input"

export interface SelectOption<ValueType> {
  value: ValueType
  label: NonNullable<React.ReactNode>
  searchTerms?: string[]
  searchImportance?: number
}

export interface SelectProps<ValueType> {
  options: Array<SelectOption<ValueType>>
  value: ValueType | null
  placeholder?: string
  title: string
  showTitleLabel?: boolean
  optional?: boolean
  required?: boolean
  subTitle?: string
  enableSearch?: boolean
  maxModalHeight?: number
  hasError?: boolean
  tooltipText?: string | JSX.Element
  testID?: string
  onSelectValue(value: ValueType, index: number): void
  renderButton?(args: { selectedValue: ValueType | null; onPress(): void }): JSX.Element
  renderItemLabel?(value: SelectOption<ValueType>): JSX.Element
  onTooltipPress?(): void
  onModalFinishedClosing?(): void
}

export const Select = <ValueType,>({
  options,
  value,
  placeholder,
  title,
  showTitleLabel = true,
  optional,
  required,
  subTitle,
  enableSearch,
  maxModalHeight,
  hasError,
  tooltipText,
  onTooltipPress,
  onSelectValue,
  renderButton,
  renderItemLabel,
  onModalFinishedClosing,
  testID,
}: SelectProps<ValueType>) => {
  const [showingModal, setShowingModal] = useState(false)

  // tinkering with RN internals here to make sure that when this select is tapped we blur
  // any text input that was focuesd at the time.
  const blurAllOtherInputs = async () => {
    const inputRef = TextInput.State.currentlyFocusedInput()

    if (inputRef) {
      TextInput.State.blurTextInput(inputRef)
      await new Promise((r) => requestAnimationFrame(r))
    }
  }

  const open = async () => {
    await blurAllOtherInputs()
    setShowingModal(true)
  }

  const close = () => {
    setShowingModal(false)
  }

  const selectedItem = options.find((o) => o.value === value)

  return (
    <>
      {renderButton?.({ selectedValue: selectedItem?.value ?? null, onPress: open }) ?? (
        <SelectButton
          testID={testID}
          title={title}
          showTitleLabel={showTitleLabel}
          subTitle={subTitle}
          tooltipText={tooltipText}
          placeholder={placeholder}
          value={selectedItem?.label}
          onPress={open}
          onTooltipPress={onTooltipPress}
          optional={optional}
          required={required}
          hasError={hasError}
        />
      )}
      <SelectModal
        visible={showingModal}
        title={title}
        enableSearch={enableSearch}
        value={value}
        options={options}
        maxHeight={maxModalHeight}
        onDismiss={close}
        onSelectValue={onSelectValue}
        renderItemLabel={renderItemLabel}
        onModalFinishedClosing={onModalFinishedClosing}
      />
    </>
  )
}

const SelectButton: React.FC<{
  value?: React.ReactNode
  title?: string
  showTitleLabel?: boolean
  subTitle?: string
  optional?: boolean
  required?: boolean
  placeholder?: string
  hasError?: boolean
  tooltipText?: string | JSX.Element
  testID?: string
  onPress(): void
  onTooltipPress?(): void
}> = ({
  value,
  placeholder,
  onPress,
  title,
  showTitleLabel,
  subTitle,
  hasError,
  tooltipText,
  optional,
  required,
  testID,
  onTooltipPress,
}) => {
  const color = useColor()
  const textStyle = useTextStyleForPalette("sm")

  return (
    <Flex>
      <Flex flexDirection="row">
        <Flex flex={1}>
          {!!showTitleLabel && (
            <InputTitle optional={optional} required={required}>
              {title}
            </InputTitle>
          )}

          {!!subTitle && (
            <Text variant="xs" color="black60" mb={0.5}>
              {subTitle}
            </Text>
          )}
        </Flex>
        {!!tooltipText && (
          <Flex justifyContent="flex-end" marginLeft="auto">
            <Text variant="xs" color="black60" mb={0.5} onPress={onTooltipPress}>
              {tooltipText}
            </Text>
          </Flex>
        )}
      </Flex>
      <TouchableOpacity accessible accessibilityRole="button" onPress={onPress} testID={testID}>
        <Flex
          px="1"
          flexDirection="row"
          height={INPUT_HEIGHT}
          borderWidth={1}
          borderColor={hasError ? color("red100") : color("black30")}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text style={textStyle} color={value ? "black100" : "black60"} mr={0.5}>
            {value ?? placeholder ?? "Pick an option"}
          </Text>
          <TriangleDown />
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}

const SelectModal: React.FC<{
  options: Array<SelectOption<unknown>>
  value: unknown | null
  title: string
  enableSearch?: boolean
  visible: boolean
  maxHeight?: number
  onDismiss(): any
  onSelectValue(value: unknown, index: number): any
  renderItemLabel?(value: SelectOption<unknown>): JSX.Element
  onModalFinishedClosing?(): void
}> = ({
  options,
  value,
  title,
  enableSearch,
  visible,
  maxHeight,
  onDismiss,
  onSelectValue,
  renderItemLabel,
  onModalFinishedClosing,
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
  }, [autocomplete, searchTerm])

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
    <FancyModal
      visible={visible}
      onBackgroundPressed={onDismiss}
      maxHeight={maxHeight}
      onModalFinishedClosing={onModalFinishedClosing}
    >
      <Flex p="2" pb={15} flexDirection="row" alignItems="center" flexGrow={0}>
        <Flex flex={1} />
        <Flex flex={2} alignItems="center">
          <Text>{title}</Text>
        </Flex>
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          style={{ flex: 1, alignItems: "flex-end" }}
        >
          <CloseIcon fill="black60" />
        </TouchableOpacity>
      </Flex>
      {!!enableSearch && (
        <Flex mb="1" mx="2">
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
              testID="select-option"
            >
              <Flex
                flexDirection="row"
                pl="2"
                pr={15}
                justifyContent="space-between"
                height={INPUT_HEIGHT}
                alignItems="center"
                flexGrow={0}
              >
                {renderItemLabel?.(item) ?? (
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    color={selected ? color("blue100") : color("black100")}
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
    </FancyModal>
  )
}
