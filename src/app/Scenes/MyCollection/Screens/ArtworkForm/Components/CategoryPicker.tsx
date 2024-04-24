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
      onSelectValue={handleChange}
      value={value}
      enableSearch={false}
      title="Medium"
      placeholder="Select"
      testID="CategorySelect"
      required={required}
      options={options}
      error={error}
      onModalFinishedClosing={onModalFinishedClosing}
    />
  )
}
