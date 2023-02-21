import { Input, InputProps, InputRef } from "palette"
import { Select } from "palette/elements/Select"
import { SelectProps } from "palette/elements/Select/Select"
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
  } & Omit<InputProps, "onChange" | "onChangeText" | "renderLeftHandSection"> &
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
      titleForSelect,
      renderButtonForSelect,
      renderItemLabelForSelect,
      ...rest
    },
    ref
  ) => {
    const [innerValue, setInnerValue] = useState(value)
    const innerRef = useRef<InputRef>(null)
    useImperativeHandle(ref, () => innerRef.current!)

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
      <Input
        {...rest}
        ref={innerRef}
        value={formatInputValue ? formatInputValue(innerValue) : value}
        onChangeText={(text) => {
          setInnerValue(text)
        }}
        renderLeftHandSection={() => (
          <Select<string>
            options={optionsForSelect}
            enableSearch={enableSearchForSelect}
            value={valueForSelect}
            maxModalHeight={maxModalHeightForSelect}
            onModalFinishedClosing={() => {
              innerRef.current?.focus()
              onModalFinishedClosingForSelect?.()
            }}
            onSelectValue={(selectValue, index) => {
              onSelectValueForSelect(selectValue, index)
            }}
            title={titleForSelect}
            renderButton={(args) => renderButtonForSelect?.(args) ?? <></>}
            renderItemLabel={(args) => renderItemLabelForSelect?.(args) ?? <></>}
          />
        )}
      />
    )
  }
)
