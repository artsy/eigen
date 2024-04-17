import {
  Spacer,
  Box,
  useSpace,
  Text,
  useScreenDimensions,
  Flex,
  Image,
} from "@artsy/palette-mobile"
import { CardTag, CardTagProps } from "./CardTag"
export interface SmallCardProps {
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
export const SmallCard: React.FC<SmallCardProps> = ({ images, title, subtitle, tag, ...rest }) => {
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()

  const sectionWidth = screenWidth - space(4)

  const heroImageWidth = (2 * sectionWidth) / 3

  const smallImageWidth = sectionWidth / 3

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
        <Flex flex={2} bg="black10" my="auto" mr={2} backgroundColor="red10">
          <Image src={images[0]} width={heroImageWidth} aspectRatio={1} />
        </Flex>

        <Spacer x="2px" />

        <Flex flex={1} my="auto" alignItems="center" backgroundColor="green10">
          {images.length < 2 && <Flex flex={1} />}
          {!!images[1] && <Image src={images[1]} width={smallImageWidth} aspectRatio={1} />}

          {!!images[2] && (
            <>
              <Spacer y="2px" />
              <Image src={images[2]} width={smallImageWidth} aspectRatio={1} />
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
        <Text variant="sm" color="black60">
          {subtitle}
        </Text>
      )}

      {!!tag && (
        <CardTag {...tag} style={{ position: "absolute", top: space(1), left: space(1) }} />
      )}
    </Box>
  )
}
