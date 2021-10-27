import { Box, Flex, Input, Join, Spacer, Text } from "palette"
import React from "react"
import { LOCALIZED_UNIT, Numeric, Range } from "./helpers"

export interface CustomSizeInputsProps {
  label: string
  range: Range
  onChange: (range: Range) => void
}

// Helpers
const getValue = (value: Numeric) => {
  if (value === "*" || value === 0) {
    return
  }

  return value.toString()
}

export const CustomSizeInputs: React.FC<CustomSizeInputsProps> = ({ label, range, onChange }) => {
  const handleInputChange = (field: string) => (text: string) => {
    const parsed = parseFloat(text)
    const value = isNaN(parsed) ? "*" : parsed

    onChange({ ...range, [field]: value })
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
            />
          </Flex>
        </Join>
      </Flex>
    </Box>
  )
}
