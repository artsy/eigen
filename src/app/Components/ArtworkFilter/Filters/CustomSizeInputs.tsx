import { Metric } from "app/Scenes/Search/UserPrefsModel"
import { Box, Flex, Input, Join, Spacer, Text, useColor } from "palette"
import React, { useState } from "react"
import { TextStyle } from "react-native"
import { Numeric, Range } from "./helpers"

export interface CustomSizeInputsProps {
  label: string
  range: Range
  active?: boolean
  onChange: (range: Range) => void
  selectedMetric: Metric
}

/**
 * Acceptable values
 * 123
 * 123.
 * 123.45
 */
const DECIMAL_REGEX = /^(\d+\.?\d{0,2})?$/

// Helpers
const getValue = (value: Numeric) => {
  if (value === "*" || value === 0) {
    return ""
  }

  return value.toString()
}

export const CustomSizeInputs: React.FC<CustomSizeInputsProps> = ({
  label,
  range,
  active,
  onChange,
  selectedMetric,
}) => {
  const color = useColor()
  const [localRange, setLocalRange] = useState(range)

  const handleInputChange = (field: keyof Range) => (text: string) => {
    if (!DECIMAL_REGEX.test(text)) {
      return
    }

    const parsed = parseFloat(text)
    const value = isNaN(parsed) ? "*" : parsed

    setLocalRange({ ...localRange, [field]: text })
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
            <Input
              description="Min"
              descriptionColor="black60"
              keyboardType="number-pad"
              onChangeText={handleInputChange("min")}
              fixedRightPlaceholder={selectedMetric}
              accessibilityLabel={`Minimum ${label} Input`}
              value={getValue(localRange.min)}
              inputTextStyle={inputTextStyle}
            />
          </Flex>
          <Flex flex={1}>
            <Input
              description="Max"
              descriptionColor="black60"
              keyboardType="number-pad"
              onChangeText={handleInputChange("max")}
              fixedRightPlaceholder={selectedMetric}
              accessibilityLabel={`Maximum ${label} Input`}
              value={getValue(localRange.max)}
              inputTextStyle={inputTextStyle}
            />
          </Flex>
        </Join>
      </Flex>
    </Box>
  )
}
