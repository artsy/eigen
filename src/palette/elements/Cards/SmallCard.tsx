import { Spacer } from "@artsy/palette-mobile"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Box, BoxProps } from "palette/elements/Box"
import { Text } from "palette/elements/Text"
import { useSpace } from "palette/hooks"
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
        <Box flex={2} bg="black10">
          <OpaqueImageView imageURL={images[0]} style={{ flex: 1 }} />
        </Box>

        <Spacer x="2px" />

        <Box flex={1}>
          {images.length < 2 && <Box flex={1} bg="black10" />}

          {!!images[1] && <OpaqueImageView imageURL={images[1]} style={{ flex: 1 }} />}

          {!!images[2] && (
            <>
              <Spacer y="2px" />
              <OpaqueImageView imageURL={images[2]} style={{ flex: 1 }} />
            </>
          )}
        </Box>
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
        <CardTag {...tag} style={{ position: "absolute", top: space("1"), left: space("1") }} />
      )}
    </Box>
  )
}
