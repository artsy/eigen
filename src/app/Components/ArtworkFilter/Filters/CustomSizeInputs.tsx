import { Box, Flex, Input, Join, Spacer, Text, useColor } from "palette"
import React from "react"
import { TextStyle } from "react-native"
import { LOCALIZED_UNIT, Numeric, Range } from "./helpers"

export interface CustomSizeInputsProps {
  label: string
  range: Range
  active?: boolean
  onChange: (range: Range) => void
}

// Helpers
const getValue = (value: Numeric) => {
  if (value === "*" || value === 0) {
    return
  }

  return value.toString()
}

export const CustomSizeInputs: React.FC<CustomSizeInputsProps> = ({
  label,
  range,
  active,
  onChange,
}) => {
  const color = useColor()
  const handleInputChange = (field: keyof Range) => (text: string) => {
    const parsed = parseFloat(text)
    const value = isNaN(parsed) ? "*" : parsed

    onChange({ ...range, [field]: value })
  }
  const inputTextStyle: TextStyle = {
    color: active ? color("black100") : color("black60"),
  }

  return (
    <Box>
      <Text variant="xs" caps mb={0.5}>
        {label}
      </Text>
      <Flex flexDirection="row">
        <Join separator={<Spacer ml={2} />}>
          <Flex flex={1}>
            <Text variant="xs" mb={0.5}>
              Min
            </Text>
            <Input
              keyboardType="number-pad"
              onChangeText={handleInputChange("min")}
              placeholder={LOCALIZED_UNIT}
              accessibilityLabel={`Minimum ${label} Input`}
              defaultValue={getValue(range.min)}
              inputTextStyle={inputTextStyle}
            />
          </Flex>
          <Flex flex={1}>
            <Text variant="xs" mb={0.5}>
              Max
            </Text>
            <Input
              keyboardType="number-pad"
              onChangeText={handleInputChange("max")}
              placeholder={LOCALIZED_UNIT}
              accessibilityLabel={`Maximum ${label} Input`}
              defaultValue={getValue(range.max)}
              inputTextStyle={inputTextStyle}
            />
          </Flex>
        </Join>
      </Flex>
    </Box>
  )
}
