import { Box } from "@artsy/palette"
import { useFormikSync } from "lib/Scenes/Consignments/v2/Form/useFormikSync"
import { Input } from "lib/Scenes/Search/Input"
import React, { useRef, useState } from "react"
import { Picker } from "react-native"

export const SizePicker: React.FC = () => {
  const formik = useFormikSync()
  const [showPicker, setShowPicker] = useState(false)
  const inputRef = useRef<Input>(null)
  const size = sizeOptions.find(sizeOption => sizeOption.value === formik.values.size)

  return (
    <Box>
      <Input
        title="Size"
        placeholder="Select"
        blurOnSubmit={true}
        value={size?.name}
        ref={inputRef}
        onTouchEnd={() => setShowPicker(true)}
      />

      {showPicker ? (
        <Picker
          style={{ height: 120, backgroundColor: "white" }}
          key="picker"
          selectedValue={formik.values.size}
          onValueChange={value => {
            formik.handleChange("size")(value)
            setShowPicker(false)
            inputRef.current?.blur()
          }}
        >
          {sizeOptions.map(({ name, value }, index) => (
            <Picker.Item color="black" label={name} value={value} key={index} />
          ))}
        </Picker>
      ) : null}
    </Box>
  )
}

const sizeOptions: Array<{
  name: string
  // FIXME: Whats should these values be in terms of the backend?
  value: string
}> = [
  { name: "Small (under 40cm)", value: "small" },
  { name: "Medium (40-70cm)", value: "medium" },
  { name: "Large (over 70cm)", value: "large" },
]
