import { Input2, Input2Props, Input2Ref } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { InputRef } from "app/Components/Input"
import { forwardRef, useImperativeHandle, useRef } from "react"

export type SearchInputProps = Input2Props

export const SearchInput = forwardRef<InputRef, SearchInputProps>(
  ({ onChangeText, onClear, ...props }, ref) => {
    const inputRef = useRef<Input2Ref>(null)
    useImperativeHandle(ref, () => inputRef.current as Input2Ref)

    return (
      <Input2
        ref={inputRef}
        testID="search-input"
        icon={<SearchIcon width={18} height={18} />}
        autoCorrect={false}
        enableClearButton
        returnKeyType="search"
        onClear={() => {
          onClear?.()
          inputRef?.current?.focus()
        }}
        // We only support up to 100 chars search in our backend,
        // anything above that would lead to an error
        maxLength={100}
        onChangeText={onChangeText}
        {...props}
        onFocus={(e) => {
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          props.onBlur?.(e)
        }}
      />
    )
  }
)
