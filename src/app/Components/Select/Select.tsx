import { SelectButton } from "app/Components/Select/Components/SelectButton"
import { SelectModal } from "app/Components/Select/Components/SelectModal"
import { isEqual } from "lodash"
import React, { useState } from "react"
import { TextInput } from "react-native"

export interface SelectOption<ValueType> {
  value: ValueType
  label: NonNullable<React.ReactNode>
  searchTerms?: string[]
  searchImportance?: number
}

export interface SelectProps<ValueType> {
  disabled?: boolean
  options: Array<SelectOption<ValueType>>
  value: ValueType | null | undefined
  placeholder?: string
  title?: string
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
  disabled = false,
  options,
  value,
  placeholder,
  title,
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

    // this is a hack to make sure that the modal doesn't open until the keyboard has been dismissed
    requestAnimationFrame(() => {
      setShowingModal(true)
    })
  }

  const close = () => {
    setShowingModal(false)
  }

  const selectedItem = options.find((o) => {
    if (typeof o.value === "string" && typeof value === "string") {
      return (
        (o.value as unknown as string).toLowerCase() === (value as unknown as string).toLowerCase()
      )
    }

    return isEqual(o.value, value)
  })

  return (
    <>
      {renderButton?.({ selectedValue: selectedItem?.value ?? null, onPress: open }) ?? (
        <SelectButton
          disabled={disabled}
          testID={testID}
          title={title}
          subTitle={subTitle}
          tooltipText={tooltipText}
          placeholder={placeholder}
          value={selectedItem?.label}
          onPress={open}
          onTooltipPress={onTooltipPress}
          optional={optional}
          required={required}
          hasError={hasError}
          modalVisible={showingModal}
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
