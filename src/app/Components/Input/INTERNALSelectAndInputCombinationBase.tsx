import { Input, InputComponentProps, InputRef } from "@artsy/palette-mobile"
import { SelectModal } from "app/Components/Select/Components/SelectModal"
import { SelectProps } from "app/Components/Select/Select"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

// Mark the props that should pass to Select Component with ForSelect suffix
type TypeForSelect = {
  [K in keyof SelectProps<string> as `${K}ForSelect`]: SelectProps<string>[K]
}

export interface ValuePayload {
  select: {
    value?: any
  }
  input: {
    value?: string
  }
}

export const INTERNALSelectAndInputCombinationBase = forwardRef<
  InputRef,
  {
    formatInputValue?: (inputValue?: string) => string | undefined
    onValueChange: (value: ValuePayload) => void
    shouldDisplayLocalError?: boolean
    validate?: () => void
    displayForSelect?: string
  } & Omit<InputComponentProps, "onChange" | "onChangeText" | "renderLeftHandSection"> &
    TypeForSelect
>(
  (
    {
      formatInputValue,
      onValueChange,
      value,
      validate,
      // props for Select
      optionsForSelect,
      enableSearchForSelect,
      valueForSelect,
      maxModalHeightForSelect,
      onModalFinishedClosingForSelect,
      onSelectValueForSelect,
      selectDisplayLabel,
      titleForSelect,
      renderItemLabelForSelect,
      ...rest
    },
    ref
  ) => {
    const [showModal, setShowModal] = useState(false)
    const [innerValue, setInnerValue] = useState(value)
    const innerRef = useRef<InputRef>(null)
    useImperativeHandle(ref, () => innerRef.current as InputRef)

    const isFirstRun = useRef(true)

    useEffect(() => {
      if (isFirstRun.current) {
        if (value?.length) {
          validate?.()
        }
        isFirstRun.current = false
        return
      }
      validate?.()
      onValueChange({ select: { value: valueForSelect }, input: { value: innerValue } })
    }, [innerValue, value, valueForSelect])

    return (
      <>
        <SelectModal
          visible={showModal}
          title={titleForSelect || "Select an option"}
          enableSearch={enableSearchForSelect}
          value={value}
          options={optionsForSelect}
          maxHeight={maxModalHeightForSelect}
          onDismiss={() => {
            setShowModal(false)
          }}
          onSelectValue={(selectValue, index) => {
            onSelectValueForSelect(selectValue as string, index)
          }}
          renderItemLabel={renderItemLabelForSelect}
          onModalFinishedClosing={() => {
            innerRef.current?.focus()
            onModalFinishedClosingForSelect?.()
          }}
        />
        <Input
          {...rest}
          ref={innerRef}
          value={formatInputValue ? formatInputValue(innerValue) : value}
          onChangeText={(text) => {
            setInnerValue(text)
          }}
          selectDisplayLabel={selectDisplayLabel || valueForSelect}
          onSelectTap={() => {
            setShowModal(true)
          }}
        />
      </>
    )
  }
)
