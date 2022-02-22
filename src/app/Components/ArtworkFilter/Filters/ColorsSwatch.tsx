import { TouchableRow, TouchableRowProps } from "app/Components/TouchableRow"
import { Box, CheckIcon, Text } from "palette"
import React from "react"

type ColorsSwatchProps = TouchableRowProps & {
  width: number
  name: string
  backgroundColor: string
  foregroundColor: string
  selected: boolean
}

export const ColorsSwatch: React.FC<ColorsSwatchProps> = ({
  width,
  name,
  backgroundColor,
  foregroundColor,
  selected,
  ...rest
}) => {
  return (
    <TouchableRow {...rest}>
      <Box width={width} py={1}>
        <Box
          position="relative"
          mx="auto"
          width="34px"
          height="34px"
          borderRadius="17px"
          bg={backgroundColor}
        >
          {!!selected && (
            <CheckIcon
              position="absolute"
              top="50%"
              left="50%"
              width="18px"
              height="18px"
              marginTop="-9px"
              marginLeft="-9px"
              fill={foregroundColor as any} // Annoying
            />
          )}
        </Box>

        <Text mt={0.5} variant="xs" textAlign="center">
          {name}
        </Text>
      </Box>
    </TouchableRow>
  )
}
