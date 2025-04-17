import { Spacer, Flex, Box, BoxProps, useTheme, Text, Image } from "@artsy/palette-mobile"
import LinearGradient from "react-native-linear-gradient"
import { CardTag, CardTagProps } from "./CardTag"

export interface MediumCardProps extends BoxProps {
  image: string
  title: string
  subtitle?: string | null
  tag?: CardTagProps
}

export const MEDIUM_CARD_HEIGHT = 370
export const MEDIUM_CARD_WIDTH = 280

/**
 * `MediumCard` is a card with one image one tall image, and text for title and subtitle
 * at the bottom.
 */
export const MediumCard: React.FC<MediumCardProps> = ({ image, title, subtitle, tag, ...rest }) => {
  const { space } = useTheme()

  return (
    <Box
      width={MEDIUM_CARD_WIDTH}
      height={MEDIUM_CARD_HEIGHT}
      flexDirection="row"
      borderRadius={4}
      overflow="hidden"
      {...rest}
    >
      <Flex flex={2} backgroundColor="mono10">
        <Image src={image} height={MEDIUM_CARD_HEIGHT} width={MEDIUM_CARD_WIDTH} />
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
        <Text
          lineHeight="20px"
          // We want to set the color to white here regardless of the theme
          color="white"
          mb={0.5}
        >
          {title}
        </Text>
        {!!subtitle && (
          <Text
            // We want to set the color to white here regardless of the theme
            color="white"
            variant="sm"
          >
            {subtitle}
          </Text>
        )}
        <Spacer y="15px" />
      </Flex>
      {!!tag && <CardTag {...tag} style={{ position: "absolute", top: 15, left: 15 }} />}
    </Box>
  )
}
