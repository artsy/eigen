import { Input, InputProps, InputRef } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { forwardRef, useImperativeHandle, useRef } from "react"

export type SearchInputProps = InputProps

export const SearchInput = forwardRef<InputRef, SearchInputProps>(
  ({ onChangeText, onClear, ...props }, ref) => {
    const inputRef = useRef<InputRef>(null)
    useImperativeHandle(ref, () => inputRef.current as InputRef)

    return (
      <Input
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
