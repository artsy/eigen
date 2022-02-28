import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { useTheme } from "palette/Theme"
import React from "react"
import LinearGradient from "react-native-linear-gradient"
import { Box, BoxProps } from "../Box"
import { Flex } from "../Flex"
import { Spacer } from "../Spacer"
import { Text } from "../Text"
import { CardTag, CardTagProps } from "./CardTag"

export interface MediumCardProps extends BoxProps {
  image: string
  title: string
  subtitle?: string
  tag?: CardTagProps
}

/**
 * `MediumCard` is a card with one image one tall image, and text for title and subtitle
 * at the bottom.
 */
export const MediumCard: React.FC<MediumCardProps> = ({ image, title, subtitle, tag, ...rest }) => {
  const { color, space } = useTheme()

  return (
    <Box width={280} height={370} flexDirection="row" borderRadius={4} overflow="hidden" {...rest}>
      <Flex flex={2} background={color("black10")}>
        <OpaqueImageView imageURL={image} style={{ flex: 1 }} />
      </Flex>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.15,
        }}
      />
      <Flex
        style={{
          position: "absolute",
          bottom: 0,
          left: 15,
          right: space(6),
        }}
      >
        <Text lineHeight="20" color={color("white100")} mb={0.5}>
          {title}
        </Text>
        {!!subtitle && (
          <Text color={color("white100")} variant="sm">
            {subtitle}
          </Text>
        )}
        <Spacer mt={15} />
      </Flex>
      {!!tag && <CardTag {...tag} style={{ position: "absolute", top: 15, left: 15 }} />}
    </Box>
  )
}
