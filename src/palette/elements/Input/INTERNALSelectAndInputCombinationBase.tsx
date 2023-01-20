import { Input, InputProps, InputRef } from "palette"
import { forwardRef, useImperativeHandle } from "react"
import { useEffect, useRef } from "react"
import { Platform } from "react-native"
import { Select } from "../Select"
import { SelectProps } from "../Select/SelectV2"

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

/** Underline bar height for text input on android when focused */
const UNDERLINE_TEXTINPUT_HEIGHT_ANDROID = 1.5

export const INTERNALSelectAndInputCombinationBase = forwardRef<
  InputRef,
  {
    onValueChange: (value: ValuePayload) => void
    shouldDisplayLocalError?: boolean
    validate?: () => void
  } & Omit<InputProps, "onChange" | "onChangeText" | "renderLeftHandSection"> &
    TypeForSelect
>(
  (
    {
      inputTextStyle = Platform.select({
        android: { paddingTop: UNDERLINE_TEXTINPUT_HEIGHT_ANDROID },
        default: {},
      }),
      onValueChange,
      shouldDisplayLocalError = true,
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
      onValueChange({ select: { value: valueForSelect }, input: { value } })
    }, [value, valueForSelect])

    return (
      <Input
        style={{ flex: 1 }}
        {...rest}
        ref={innerRef}
        value={value}
        inputTextStyle={inputTextStyle}
        onChangeText={(text) =>
          onValueChange({ select: { value: valueForSelect }, input: { value: text } })
        }
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
