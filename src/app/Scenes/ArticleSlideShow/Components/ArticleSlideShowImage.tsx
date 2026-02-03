import { Flex, Image, Spinner } from "@artsy/palette-mobile"
import { ArticleSlideShowImage_figure$key } from "__generated__/ArticleSlideShowImage_figure.graphql"
import { sizeToFit } from "app/utils/useSizeToFit"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Dimensions, View } from "react-native"
import { useFragment, graphql } from "react-relay"

interface ArticleSlideShowImageProps {
  figure: ArticleSlideShowImage_figure$key
  hideLeftArrow?: boolean
  hideRightArrow?: boolean
}

export const ArticleSlideShowImage: React.FC<ArticleSlideShowImageProps> = ({ figure }) => {
  const containerRef = useRef<View>(null)
  const [viewSize, setViewSize] = useState({ height: 0, width: 0 })
  const [measureKey, setMeasureKey] = useState(0)
  const data = useFragment(fragment, figure)
  const typename = data?.__typename

  useEffect(() => {
    // orientation changed, trigger re-measurement
    const dimensionsEventSubscription = Dimensions.addEventListener("change", () => {
      setMeasureKey((prev) => prev + 1)
    })
    return () => dimensionsEventSubscription.remove()
  }, [])

  useLayoutEffect(() => {
    containerRef.current?.measureInWindow((_x, _y, width, height) => {
      if (height !== viewSize.height || width !== viewSize.width) {
        setViewSize({ width, height })
      }
    })
  }, [measureKey, viewSize.height, viewSize.width])

  const size = useMemo(() => {
    if (!data || data.__typename === "%other" || !data.image) {
      return null
    }

    const image = data.image
    return sizeToFit({ width: image.width ?? 0, height: image.height ?? 0 }, viewSize)
  }, [data, viewSize])

  if (
    !typename ||
    (typename !== "ArticleImageSection" &&
      typename !== "ArticleUnpublishedArtwork" &&
      typename !== "Artwork")
  ) {
    return null
  }

  const image = data.image?.url

  if (!image || !size) {
    return null
  }

  return (
    <Flex
      ref={containerRef}
      flex={1}
      justifyContent="center"
      alignItems="center"
      testID="image-container"
    >
      {viewSize.height === 0 ? (
        <Spinner />
      ) : (
        <Image
          src={image}
          width={size.width}
          height={size.height}
          resizeMode="contain"
          testID="slide-image"
        />
      )}
    </Flex>
  )
}

const fragment = graphql`
  fragment ArticleSlideShowImage_figure on ArticleSectionImageCollectionFigure {
    __typename
    ... on Artwork {
      image {
        width
        height
        aspectRatio
        url(version: ["main", "normalized", "larger", "large"])
      }
    }
    ... on ArticleImageSection {
      image {
        width
        height
        aspectRatio
        url(version: ["main", "normalized", "larger", "large"])
      }
    }
    ... on ArticleUnpublishedArtwork {
      image {
        width
        height
        aspectRatio
        url(version: ["main", "normalized", "larger", "large"])
      }
    }
  }
`
