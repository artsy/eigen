import { Box, Flex, Input2, Join, Spacer, Text } from "@artsy/palette-mobile"
import { Metric } from "app/Scenes/Search/UserPrefsModel"
import React, { useState } from "react"
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
  onChange,
  selectedMetric,
}) => {
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

  return (
    <Box>
      <Text variant="xs" caps mb={0.5}>
        {label}
      </Text>
      <Flex flexDirection="row">
        <Join separator={<Spacer x={2} />}>
          <Flex flex={1}>
            <Input2
              title="Min"
              keyboardType="number-pad"
              onChangeText={handleInputChange("min")}
              fixedRightPlaceholder={selectedMetric}
              accessibilityLabel={`Minimum ${label} Input`}
              value={getValue(localRange.min)}
            />
          </Flex>
          <Flex flex={1}>
            <Input2
              title="Max"
              keyboardType="number-pad"
              onChangeText={handleInputChange("max")}
              fixedRightPlaceholder={selectedMetric}
              accessibilityLabel={`Maximum ${label} Input`}
              value={getValue(localRange.max)}
            />
          </Flex>
        </Join>
      </Flex>
    </Box>
  )
}
