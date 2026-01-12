import { Select, SelectOption, SelectRef } from "app/Components/Select"

interface ArtworkCategoryPickerProps<T> {
  error?: string
  handleChange: (v: T) => void
  onModalFinishedClosing?: () => void
  options: Array<SelectOption<T>>
  required?: boolean
  value: T | null | undefined
  ref?: React.Ref<SelectRef>
}

export const CategoryPicker = <ValueType,>({
  error,
  handleChange,
  onModalFinishedClosing,
  options,
  required = true,
  value,
  ref,
}: ArtworkCategoryPickerProps<ValueType>) => {
  return (
    <Select<ValueType>
      ref={ref}
      enableSearch={false}
      error={error}
      onModalFinishedClosing={onModalFinishedClosing}
      onSelectValue={handleChange}
      options={options}
      placeholder="Select"
      required={required}
      testID="CategorySelect"
      title="Medium"
      value={value}
    />
  )
}
