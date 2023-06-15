import { Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { ArticleSectionImageCollectionImage_figure$key } from "__generated__/ArticleSectionImageCollectionImage_figure.graphql"
import { MotiView } from "moti"
import { useState } from "react"
import FastImage from "react-native-fast-image"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionImageCollectionImageProps {
  figure: ArticleSectionImageCollectionImage_figure$key
}

export const ArticleSectionImageCollectionImage: React.FC<
  ArticleSectionImageCollectionImageProps
> = ({ figure }) => {
  const [loading, setLoading] = useState(true)
  const { width } = useScreenDimensions()

  const data = useFragment(ArticleSectionImageCollectionImageQuery, figure)

  if (!data.image?.resized?.src) {
    return null
  }

  const dimensions = { width, height: width / data.image.aspectRatio }

  return (
    <Flex position="relative">
      <MotiView animate={{ opacity: loading ? 1 : 0 }} style={{ position: "absolute", zIndex: 1 }}>
        <Flex {...dimensions} backgroundColor="black10" />
      </MotiView>

      <FastImage
        style={dimensions}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        source={{
          uri: data.image.resized.src,
          priority: FastImage.priority.normal,
        }}
      />
    </Flex>
  )
}

const ArticleSectionImageCollectionImageQuery = graphql`
  fragment ArticleSectionImageCollectionImage_figure on ArticleSectionImageCollectionFigure {
    ... on ArticleImageSection {
      id
      image {
        resized(width: 1000) {
          src
          width
          height
        }
        aspectRatio
      }
    }
    ... on Artwork {
      id
      image {
        resized(width: 1000) {
          src
          width
          height
        }
        aspectRatio
      }
    }
    ... on ArticleUnpublishedArtwork {
      id
      image {
        resized(width: 1000) {
          src
          width
          height
        }
        aspectRatio
      }
    }
  }
`
