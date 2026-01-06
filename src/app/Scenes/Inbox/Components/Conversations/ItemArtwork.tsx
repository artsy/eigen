import { Box, Flex, Image, Separator, Text } from "@artsy/palette-mobile"
import { ItemArtwork_artwork$data } from "__generated__/ItemArtwork_artwork.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { createFragmentContainer, graphql } from "react-relay"

interface ItemArtworkProps {
  artwork: ItemArtwork_artwork$data
}

export const ItemArtwork: React.FC<ItemArtworkProps> = ({ artwork }) => {
  return (
    <>
      <Flex flexDirection="column" p={2}>
        <Text variant="sm-display" mb={2} weight="medium">
          Artwork
        </Text>

        <RouterLink to={artwork.href}>
          <Flex flexDirection="row">
            <Box height="100px" width="100px" justifyContent="center" backgroundColor="pink">
              {!!artwork.image?.thumbnailUrl && (
                <Image
                  testID="artworkImage"
                  src={artwork.image?.thumbnailUrl}
                  width={100}
                  height={100}
                  blurhash={artwork.image?.blurhash}
                />
              )}
            </Box>

            <Flex flexDirection="column" ml={2} flexShrink={1}>
              <Text variant="sm" numberOfLines={1}>
                {artwork.artistNames}
              </Text>
              <Text variant="sm" color="mono60" numberOfLines={1} italic>
                {[artwork.title, artwork.date].join(", ")}
              </Text>
              {!!artwork.partner?.name && (
                <Text variant="sm" color="mono60" numberOfLines={1}>
                  {artwork.partner.name}
                </Text>
              )}
              <Text variant="sm" numberOfLines={1}>
                {artwork.saleMessage}
              </Text>
            </Flex>
          </Flex>
        </RouterLink>
      </Flex>
      <Separator my={1} />
    </>
  )
}

export const ItemArtworkFragmentContainer = createFragmentContainer(ItemArtwork, {
  artwork: graphql`
    fragment ItemArtwork_artwork on Artwork {
      href
      image {
        thumbnailUrl: url(version: "small")
        blurhash
      }
      title
      artistNames
      date
      saleMessage
      partner {
        name
      }
    }
  `,
})
