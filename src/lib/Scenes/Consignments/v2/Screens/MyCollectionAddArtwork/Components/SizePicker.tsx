import { Select } from "lib/Components/Select"
import { useArtworkForm } from "lib/Scenes/Consignments/v2/Screens/MyCollectionAddArtwork/Form/useArtworkForm"
import React, { useRef } from "react"

export const SizePicker: React.FC = () => {
  const { formik } = useArtworkForm()
  const sizeRef = useRef<Select<any>>(null)

  const handleValueChange = (value: string) => {
    formik.handleChange("size")(value)
  }

  return (
    <Select
      ref={sizeRef}
      onSelectValue={handleValueChange}
      value={formik.values.size}
      enableSearch={false}
      title="Size"
      subTitle="This is based on the artwork’s average dimension."
      placeholder="Size"
      options={sizeOptions}
    />
  )
}

const sizeOptions: Array<{
  label: string
  // FIXME: Whats should these values be in terms of the backend?
  value: string
}> = [
  { label: "Small (under 40cm)", value: "small" },
  { label: "Medium (40-70cm)", value: "medium" },
  { label: "Large (over 70cm)", value: "large" },
]
