import { Spacer, Box, BoxProps, Text, Image } from "@artsy/palette-mobile"
import { ShowInstallShots_show$data } from "__generated__/ShowInstallShots_show.graphql"
import { compact } from "lodash"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface ShowInstallShotsProps extends BoxProps {
  show: ShowInstallShots_show$data
}

export const ShowInstallShots: React.FC<ShowInstallShotsProps> = ({ show, ...rest }) => {
  const images = compact(show.images)

  return (
    <Box {...rest}>
      <FlatList<(typeof images)[number]>
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={<Spacer x={1} />}
        ListFooterComponent={<Spacer x={1} />}
        ItemSeparatorComponent={() => <Spacer x={0.5} />}
        keyExtractor={(image, i) => String(image.internalID || i)}
        renderItem={({ item: image }) => {
          if (!image.src || !image.dimensions || !image.dimensions.width) {
            return null
          }

          return (
            <Box>
              {!!image.dimensions.height && (
                <Image
                  width={image.dimensions.width}
                  height={image.dimensions.height}
                  src={image.src}
                />
              )}

              {!!image.caption && (
                <Text
                  variant="xs"
                  color="mono60"
                  mt={0.5}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ width: image.dimensions.width }}
                >
                  {image.caption}
                </Text>
              )}
            </Box>
          )
        }}
      />
    </Box>
  )
}

export const ShowInstallShotsFragmentContainer = createFragmentContainer(ShowInstallShots, {
  show: graphql`
    fragment ShowInstallShots_show on Show {
      name
      images(default: false) {
        internalID
        caption
        src: url(version: ["larger", "large"])
        dimensions: resized(height: 300) {
          width
          height
        }
      }
    }
  `,
})
