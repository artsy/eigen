import { TriangleDownIcon } from "@artsy/icons/native"
import {
  Autocomplete,
  Spacer,
  CloseIcon,
  CheckIcon,
  Flex,
  useColor,
  Text,
  Separator,
  PopIn,
  Touchable,
} from "@artsy/palette-mobile"
import { INPUT_HEIGHT, InputTitle } from "app/Components/Input"
import { SearchInput } from "app/Components/SearchInput"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Modal, TextInput, TouchableOpacity } from "react-native"

export interface SelectOption<ValueType> {
  value: ValueType
  label: NonNullable<React.ReactNode>
  searchTerms?: string[]
  searchImportance?: number
}

const ROW_HEIGHT = 40
export interface SelectProps<ValueType> {
  options: Array<SelectOption<ValueType>>
  value: ValueType | null
  placeholder?: string
  title: string
  subTitle?: string
  enableSearch?: boolean
  maxModalHeight?: number
  hasError?: boolean
  required?: boolean
  testID?: string
  onSelectValue(value: ValueType, index: number): void
  renderButton?(args: { selectedValue: ValueType | null; onPress(): void }): JSX.Element
  renderItemLabel?(value: SelectOption<ValueType>): JSX.Element
  onModalFinishedClosing?(): void
}
interface State {
  showingModal: boolean
}
export class Select<ValueType> extends React.Component<SelectProps<ValueType>, State> {
  state: State = { showingModal: false }

  async open() {
    // tinkering with RN internals here to make sure that when this select is tapped we blur
    // any text input that was focuesd at the time.
    const inputRef = TextInput.State.currentlyFocusedInput()
    if (inputRef) {
      TextInput.State.blurTextInput(inputRef)
      await new Promise((r) => requestAnimationFrame(r))
    }
    await new Promise<void>((r) => this.setState({ showingModal: true }, r))
  }

  close() {
    this.setState({ showingModal: false })
  }

  render() {
    const {
      options,
      onSelectValue,
      value,
      placeholder,
      enableSearch,
      title,
      subTitle,
      maxModalHeight,
      hasError,
    } = this.props

    const selectedItem = options.find((o) => o.value === value)
    return (
      <>
        {this.props.renderButton?.({
          selectedValue: selectedItem?.value ?? null,
          onPress: this.open.bind(this),
        }) ?? (
          <SelectButton
            testID={this.props.testID}
            title={title}
            subTitle={subTitle}
            placeholder={placeholder}
            value={selectedItem?.label}
            onPress={this.open.bind(this)}
            hasError={hasError}
          />
        )}
        <SelectModal
          visible={this.state.showingModal}
          title={title}
          enableSearch={enableSearch}
          value={value}
          options={options}
          maxHeight={maxModalHeight}
          onDismiss={this.close.bind(this)}
          onSelectValue={onSelectValue}
          renderItemLabel={this.props.renderItemLabel}
          onModalFinishedClosing={this.props.onModalFinishedClosing}
        />
      </>
    )
  }
}

const SelectButton: React.FC<{
  value?: React.ReactNode
  title?: string
  subTitle?: string
  placeholder?: string
  hasError?: boolean
  testID?: string
  onPress(): void
}> = ({ value, placeholder, onPress, title, subTitle, hasError, testID }) => {
  const color = useColor()
  return (
    <Flex>
      <InputTitle>{title}</InputTitle>

      {subTitle ? (
        <Text variant="xs" mb={0.5} color={color("mono60")}>
          {subTitle}
        </Text>
      ) : (
        <Spacer y={0.5} />
      )}
      <TouchableOpacity accessible accessibilityRole="button" onPress={onPress} testID={testID}>
        <Flex
          px={1}
          flexDirection="row"
          height={INPUT_HEIGHT}
          borderWidth={1}
          borderColor={hasError ? color("red100") : color("mono10")}
          justifyContent="space-between"
          alignItems="center"
        >
          {value ? (
            <Text variant="sm" color="mono100">
              {value}
            </Text>
          ) : (
            <Text variant="sm" color="mono60">
              {placeholder ?? "Pick an option"}
            </Text>
          )}
          <TriangleDownIcon />
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
}> = (props) => {
  const color = useColor()

  // we need to be able to have a local version of the value state so we can show the updated
  // state between the moment the user taps a selection and the moment we automatically
  // close the modal. We don't want to tell the consuming component about the user's selection until the
  // animation is finished, so they don't have to worry about waiting for the animation to finish if they need
  // to trigger further actions as a result.
  const [localValue, setValue] = useState(props.value)
  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const selectedItem = props.options.find((o) => o.value === localValue)

  const autocomplete = useMemo(() => {
    return props.enableSearch
      ? new Autocomplete<SelectOption<unknown>>(
          props.options.map((option) => {
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
  }, [props.enableSearch, props.options])

  const [searchTerm, setSearchTerm] = useState("")

  // reset the search term whenever we show the modal
  useEffect(() => {
    if (props.visible) {
      setSearchTerm("")
    }
  }, [props.visible])

  const autocompleteResults = useMemo(() => {
    return searchTerm && autocomplete ? autocomplete.getSuggestions(searchTerm) : props.options
  }, [autocomplete, searchTerm])

  const flatListRef = useRef<FlatList>(null)
  const flatListHeight = useRef<number | null>(null)

  // scroll to show the selected value whenever we either clear the
  // search input, or show the modal.
  useEffect(() => {
    if (!props.visible) {
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
        const initialScrollIndex = props.options.indexOf(selectedItem)
        // try to center the option on screen
        const initialScrollOffset =
          initialScrollIndex * ROW_HEIGHT - (flatListHeight.current ?? 0) / 2 + ROW_HEIGHT
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
  }, [searchTerm, props.visible])

  return (
    <Modal visible={props.visible} onDismiss={props.onDismiss} onRequestClose={props.onDismiss}>
      <Flex p={2} pb="15px" flexDirection="row" alignItems="center" flexGrow={0}>
        <Flex flex={1} />
        <Flex flex={2} alignItems="center">
          <Text variant="sm-display" weight="medium">
            {props.title}
          </Text>
        </Flex>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Close Select Modal"
          onPress={props.onDismiss}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          style={{ flex: 1, alignItems: "flex-end" }}
        >
          <CloseIcon fill="mono60" />
        </TouchableOpacity>
      </Flex>
      {!!props.enableSearch && (
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
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
        })}
        style={{ flex: 1 }}
        onLayout={(e) => (flatListHeight.current = e.nativeEvent.layout.height)}
        renderItem={({ item, index }) => (
          <Touchable
            accessibilityRole="button"
            underlayColor={color("mono10")}
            onPress={() => {
              setValue(item.value)
              // give the pop-in animation a chance to play
              setTimeout(() => {
                props.onDismiss()
                props.onSelectValue(item.value, index)
              }, 400)
            }}
            style={{ flexGrow: 0 }}
          >
            <Flex
              flexDirection="row"
              pl={2}
              pr="15px"
              justifyContent="space-between"
              height={ROW_HEIGHT}
              alignItems="center"
              backgroundColor={localValue === item.value ? "mono5" : "mono0"}
              flexGrow={0}
            >
              {props.renderItemLabel?.(item) ?? (
                <Text
                  variant="sm-display"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ flexShrink: 1 }}
                >
                  {item.label}
                </Text>
              )}
              {localValue === item.value ? (
                <PopIn>
                  <CheckIcon width={25} height={25} />
                </PopIn>
              ) : null}
            </Flex>
          </Touchable>
        )}
      />
    </Modal>
  )
}
