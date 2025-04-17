import { Spacer, Box, useSpace, Text, Flex, BoxProps } from "@artsy/palette-mobile"
import FastImage from "react-native-fast-image"
import { CardTag, CardTagProps } from "./CardTag"
export interface SmallCardProps extends BoxProps {
  images: string[]
  title?: string
  subtitle?: string
  tag?: CardTagProps
}

/**
 * `SmallCard` is a card with a layout one square image on the left,
 * one tall or two square images on the right, and text for title and subtitle
 * at the bottom.
 */
// TODO: Fix palette image to accept aspectRatio only and respect flex props and use it here
export const SmallCard: React.FC<SmallCardProps> = ({ images, title, subtitle, tag, ...rest }) => {
  const space = useSpace()

  return (
    <Box {...rest}>
      <Box
        width="100%"
        flexDirection="row"
        borderRadius={4}
        overflow="hidden"
        style={{
          aspectRatio: 1.5 / 1.0,
        }}
      >
        <Flex flex={2} bg="mono10" my="auto" mr={2}>
          <FastImage source={{ uri: images[0] }} style={{ flex: 1, aspectRatio: 1 }} />
        </Flex>

        <Spacer x="2px" />

        <Flex flex={1} my="auto" alignItems="center">
          {images.length < 2 && <Flex flex={1} />}
          {!!images[1] && (
            <FastImage source={{ uri: images[1] }} style={{ flex: 1, aspectRatio: 1 }} />
          )}

          {!!images[2] && (
            <>
              <Spacer y="2px" />
              <FastImage source={{ uri: images[2] }} style={{ flex: 1, aspectRatio: 1 }} />
            </>
          )}
        </Flex>
      </Box>

      {!!title && (
        <Text variant="sm" mt={1}>
          {title}
        </Text>
      )}

      {!!subtitle && (
        <Text variant="sm" color="mono60">
          {subtitle}
        </Text>
      )}

      {!!tag && (
        <CardTag {...tag} style={{ position: "absolute", top: space(1), left: space(1) }} />
      )}
    </Box>
  )
}
