import { Select, SelectOption } from "app/Components/Select"

interface ArtworkCategoryPickerProps<T> {
  error?: string
  handleChange: (v: T) => void
  onModalFinishedClosing?: () => void
  options: Array<SelectOption<T>>
  required?: boolean
  value: T | null | undefined
}

export const CategoryPicker = <ValueType,>({
  error,
  handleChange,
  onModalFinishedClosing,
  options,
  required = true,
  value,
}: ArtworkCategoryPickerProps<ValueType>) => {
  return (
    <Select<ValueType>
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
