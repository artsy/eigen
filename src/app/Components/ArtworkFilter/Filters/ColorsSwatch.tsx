import { Box, CheckIcon, Color, Text } from "@artsy/palette-mobile"
import { TouchableRow, TouchableRowProps } from "app/Components/TouchableRow"

type ColorsSwatchProps = TouchableRowProps & {
  width: number
  name: string
  backgroundColor: string
  foregroundColor?: Color
  selected: boolean
}

export const ColorsSwatch: React.FC<ColorsSwatchProps> = ({
  width,
  name,
  backgroundColor,
  foregroundColor = "mono0",
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
              testID={`check-icon-${name}`}
              fill={foregroundColor}
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
