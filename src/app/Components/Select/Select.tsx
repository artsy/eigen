import { SelectButton } from "app/Components/Select/Components/SelectButton"
import { SelectModal } from "app/Components/Select/Components/SelectModal"
import { isEqual } from "lodash"
import React, { useImperativeHandle, useState } from "react"
import { TextInput } from "react-native"

export interface SelectOption<ValueType> {
  value: ValueType
  label: NonNullable<React.ReactNode>
  searchTerms?: string[]
  searchImportance?: number
}

export interface SelectRef {
  openSelectModal: () => void
  closeSelectModal: () => void
}

export interface SelectProps<ValueType> {
  disabled?: boolean
  enableSearch?: boolean
  error?: string
  hasError?: boolean
  maxModalHeight?: number
  onModalFinishedClosing?(): void
  onSelectValue(value: ValueType, index: number): void
  onTooltipPress?(): void
  optional?: boolean
  options: Array<SelectOption<ValueType>>
  placeholder?: string
  renderButton?(args: { selectedValue: ValueType | null; onPress(): void }): React.JSX.Element
  renderItemLabel?(value: SelectOption<ValueType>): React.JSX.Element
  required?: boolean
  subTitle?: string
  testID?: string
  title?: string
  tooltipText?: string | React.JSX.Element
  value: ValueType | null | undefined
  ref?: React.Ref<SelectRef>
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
  error,
  ref,
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

  useImperativeHandle(ref, () => ({
    openSelectModal: open,
    closeSelectModal: close,
  }))

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
          hasError={hasError || !!error}
          modalVisible={showingModal}
          error={error}
        />
      )}
      <SelectModal
        visible={showingModal}
        title={title}
        testID={`modal-${testID}`}
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
