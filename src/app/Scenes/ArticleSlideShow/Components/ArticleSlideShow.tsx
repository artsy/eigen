import { CloseIcon, Flex, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import {
  ArticleSlideShow_article$data,
  ArticleSlideShow_article$key,
} from "__generated__/ArticleSlideShow_article.graphql"
import { ArticleSlideShowCaption } from "app/Scenes/ArticleSlideShow/Components/ArticleSlideShowCaption"
import { ArticleSlideShowImage } from "app/Scenes/ArticleSlideShow/Components/ArticleSlideShowImage"
import { goBack } from "app/system/navigation/navigate"
import { compact } from "lodash"
import { MotiView } from "moti"
import { useMemo, useState } from "react"
import { ViewToken } from "react-native"
import { graphql, useFragment } from "react-relay"

const TITLE_MIN_HEIGHT = 140

interface ArticleSlideShowProps {
  coverId: string
  article: ArticleSlideShow_article$key
}

export const ArticleSlideShow: React.FC<ArticleSlideShowProps> = ({ article, coverId }) => {
  const [currentSlide, setCurrentSlide] = useState<null | number>(null)
  const { width } = useScreenDimensions()
  const data = useFragment(fragment, article)

  const figures = useMemo(() => getFigures(data), [data?.sections])

  // Finds the index of the given figure ID to start the gallery at
  const initialCursor = figures.findIndex((figure) => {
    if (
      figure.__typename === "Artwork" ||
      figure.__typename === "ArticleImageSection" ||
      figure.__typename === "ArticleUnpublishedArtwork"
    ) {
      return figure.id === coverId
    }
  })

  const currentIndex = currentSlide ?? initialCursor
  const currentFigure = figures[currentIndex]

  if (!data) {
    return null
  }

  const onViewableItemsChanged = (info: { viewableItems: ViewToken[] }) => {
    if (info.viewableItems.length > 0) {
      const index = info.viewableItems[0].index
      if (!!index && currentSlide !== index) {
        setCurrentSlide(index)
      }
    }
  }

  const title =
    currentFigure?.section.__typename === "ArticleSectionImageSet" && currentFigure.section?.title
      ? currentFigure.section.title
      : ""

  return (
    <Flex flex={1}>
      <Flex flexDirection="row" p={2} justifyContent="space-between" minHeight={TITLE_MIN_HEIGHT}>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ flex: 1 }}
        >
          <Text variant="lg-display" pr={2}>
            {title}
          </Text>
        </MotiView>

        <Touchable accessibilityRole="button" accessibilityLabel="Close" onPress={() => goBack()}>
          <CloseIcon height={24} width={24} />
        </Touchable>
      </Flex>

      <Flex flexDirection="row" flex={1}>
        <FlashList
          accessibilityLabel="Image and description rail"
          data={figures}
          horizontal
          keyExtractor={({ id }) => `ArticleSlideShowItem-${id}`}
          snapToInterval={width}
          estimatedItemSize={width}
          pagingEnabled
          initialScrollIndex={currentIndex}
          viewabilityConfig={{
            waitForInteraction: true,
            itemVisiblePercentThreshold: 55,
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item, index }) => {
            return (
              <Flex flex={1} width={width}>
                <ArticleSlideShowImage figure={item} />

                <Flex p={4} flexDirection="row" alignItems="center" justifyContent="space-between">
                  <ArticleSlideShowCaption figure={item} />
                  <Text>{`${index + 1} of ${figures.length}`}</Text>
                </Flex>
              </Flex>
            )
          }}
        />
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArticleSlideShow_article on Article {
    sections {
      __typename
      ... on ArticleSectionImageCollection {
        figures {
          ...ArticleSlideShowImage_figure
          ...ArticleSlideShowCaption_figure
          __typename
          ... on Artwork {
            id
          }
          ... on ArticleImageSection {
            id
          }
          ... on ArticleUnpublishedArtwork {
            id
          }
        }
      }
      ... on ArticleSectionImageSet {
        title
        figures {
          ...ArticleSlideShowImage_figure
          ...ArticleSlideShowCaption_figure
          __typename
          ... on Artwork {
            id
          }
          ... on ArticleImageSection {
            id
          }
        }
      }
    }
  }
`

export const getFigures = (data: ArticleSlideShow_article$data) => {
  return compact(
    data.sections.flatMap((section) => {
      if (
        section.__typename === "ArticleSectionImageSet" ||
        section.__typename === "ArticleSectionImageCollection"
      ) {
        return section.figures.map((figure) => ({ ...figure, section }))
      }
    })
  )
}
