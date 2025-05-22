import { NoArtIcon } from "@artsy/icons/native"
import { Flex, Image, useScreenDimensions, useSpace, Join, Spacer } from "@artsy/palette-mobile"
import { MyCollectionPreview_me$key } from "__generated__/MyCollectionPreview_me.graphql"
import { MyCollectionBannerEmptyState } from "app/Scenes/MyProfile/Components/UserAccountHeader/MyCollectionBannerEmptyState"
import { extractNodes } from "app/utils/extractNodes"
import { graphql, useFragment } from "react-relay"

interface MyCollectionPreviewProps {
  me: MyCollectionPreview_me$key
}

export const MyCollectionPreview: React.FC<MyCollectionPreviewProps> = ({ me }) => {
  const data = useFragment(myCollectionPreviewFragment, me)
  const artworks = extractNodes(data.myCollectionConnection)

  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()

  if (!artworks || artworks.length === 0) {
    return <MyCollectionBannerEmptyState />
  }

  let displayArtworks = artworks
  if (artworks.length < 4) {
    displayArtworks = [...artworks, ...Array(4 - artworks.length).fill({})]
  }

  // We need to add 2 spaces for the left and right padding, and 3 spaces for the separator
  const imageWidth = (screenWidth - space(2) * 2 * 2 - space(0.5) * 3) / 4

  return (
    <Flex flexDirection="row">
      <Join separator={<Spacer x={0.5} />}>
        {displayArtworks.map((artwork, index) => {
          if (!artwork?.internalID) {
            return (
              <Flex
                key={index}
                width={imageWidth}
                height={imageWidth}
                backgroundColor="mono5"
                testID="artwork-preview-placeholder"
              />
            )
          }

          const imageUrl = artwork?.image?.resized?.url || artwork?.image?.imageURL

          return (
            <Flex key={index} overflow="hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  width={imageWidth}
                  height={imageWidth}
                  blurhash={artwork.image.blurhash}
                  testID="artwork-preview-image"
                />
              ) : (
                <Flex
                  backgroundColor="mono5"
                  alignItems="center"
                  justifyContent="center"
                  width={imageWidth}
                  height={imageWidth}
                  testID="artwork-without-image"
                >
                  {!!artwork?.internalID && <NoArtIcon fill="mono30" />}
                </Flex>
              )}
            </Flex>
          )
        })}
      </Join>
    </Flex>
  )
}

const myCollectionPreviewFragment = graphql`
  fragment MyCollectionPreview_me on Me {
    myCollectionConnection(first: 4, sort: CREATED_AT_DESC)
      @connection(key: "MyCollectionPreview_myCollectionConnection", filters: []) {
      edges {
        node {
          internalID
          image {
            resized {
              url
            }
            imageURL
            blurhash
          }
        }
      }
    }
  }
`
