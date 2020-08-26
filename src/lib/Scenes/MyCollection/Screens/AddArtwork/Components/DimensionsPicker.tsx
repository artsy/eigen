import { Select } from "lib/Components/Select"
import { useArtworkForm } from "lib/Scenes/MyCollection/Screens/AddArtwork/Form/useArtworkForm"
import React, { useRef } from "react"

export const DimensionsPicker: React.FC = () => {
  const { formik } = useArtworkForm()
  const dimensionsRef = useRef<Select<any>>(null)

  const handleValueChange = (value: string) => {
    formik.handleChange("dimensions")(value)
  }

  return (
    <Select
      ref={dimensionsRef}
      onSelectValue={handleValueChange}
      value={formik.values.dimensions}
      enableSearch={false}
      title="Size"
      subTitle="This is based on the artwork’s average dimension."
      placeholder="Select"
      options={dimensionOptions}
    />
  )
}

const dimensionOptions: Array<{
  label: string
  value: string
}> = [
  { label: "Small (under 40cm)", value: "small" },
  { label: "Medium (40-70cm)", value: "medium" },
  { label: "Large (over 70cm)", value: "large" },
]
