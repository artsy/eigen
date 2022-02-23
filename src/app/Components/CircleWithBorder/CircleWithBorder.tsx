import { Flex, FlexProps } from "palette"
import React from "react"

interface CircleWithBorderProps extends FlexProps {
  backgroundColor: string
  borderColor: string
  borderWidth: number
  diameter: number
}

//  It seems like React Native has a bug on iOS that causes some of the background to bleed
//  so using a circle within a circle as a workaround
export const CircleWithBorder: React.FC<CircleWithBorderProps> = ({
  backgroundColor,
  diameter,
  borderColor,
  borderWidth,
  ...wrapperProps
}) => (
  <Flex justifyContent="center" alignItems="center" backgroundColor={borderColor} {...wrapperProps}>
    <Flex
      justifyContent="center"
      alignItems="center"
      borderRadius={diameter / 2}
      width={diameter}
      height={diameter}
      backgroundColor={borderColor}
    >
      <Flex
        borderRadius={(diameter - borderWidth) / 2}
        width={diameter - 2 * borderWidth}
        height={diameter - 2 * borderWidth}
        margin={borderWidth}
        backgroundColor={backgroundColor}
      />
    </Flex>
  </Flex>
)
