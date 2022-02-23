import { TextVariant } from "@artsy/palette-tokens/dist/typography/v3"
import { Box, BoxProps } from "palette/elements/Box/Box"
import { Text } from "palette/elements/Text/Text"
import React from "react"
import { Easing } from "react-native"
import TextTicker from "react-native-text-ticker"

export interface MarqueeProps extends BoxProps {
  speed?: number
  textVariant?: TextVariant
  marqueeText: string
}

export const Marquee: React.FC<MarqueeProps> = ({
  marqueeText,
  textVariant = "sm",
  speed = 15000,
}) => {
  return (
    <TextTicker duration={speed} repeatSpacer={0} loop easing={Easing.linear}>
      {Array.from(Array(10)).map((_, i) => (
        <Box key={i} flexDirection="row" bg="black100" py={0.5}>
          <Text variant={textVariant} px={2} color="white100">
            {marqueeText}
          </Text>
          <Text variant={textVariant} px={2} color="white100">
            •
          </Text>
        </Box>
      ))}
    </TextTicker>
  )
}
