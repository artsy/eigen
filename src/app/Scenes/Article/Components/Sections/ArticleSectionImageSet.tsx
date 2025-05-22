import {
  Flex,
  Image,
  ImageSetIcon,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { ArticleSectionImageSet_article$data } from "__generated__/ArticleSectionImageSet_article.graphql"
import { ArticleSectionImageSet_section$data } from "__generated__/ArticleSectionImageSet_section.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { graphql, useFragment } from "react-relay"

interface ArticleSectionImageSetProps {
  article: any
  section: any
}

export const ArticleSectionImageSet: React.FC<ArticleSectionImageSetProps> = ({
  section,
  article,
}) => {
  const sectionData = useFragment(fragmentSection, section)
  const articleData = useFragment(fragmentArticle, article)

  if (!sectionData) {
    return null
  }

  switch (sectionData.layout) {
    case "MINI":
      return <LayoutMini section={sectionData} article={articleData} />

    case "FULL":
      return <LayoutFull section={sectionData} article={articleData} hideImage />
    default:
      return null
  }
}

const fragmentSection = graphql`
  fragment ArticleSectionImageSet_section on ArticleSectionImageSet {
    layout
    title
    counts {
      figures
    }
    cover {
      __typename
      ... on ArticleImageSection {
        id
        image {
          url(version: ["main", "normalized", "larger", "large"])
          width
          height
        }
      }
      ... on Artwork {
        id
        image {
          url(version: ["main", "normalized", "larger", "large"])
          width
          height
        }
      }
    }
  }
`

const fragmentArticle = graphql`
  fragment ArticleSectionImageSet_article on Article {
    internalID
  }
`

interface LayoutProps {
  section: ArticleSectionImageSet_section$data
  article: ArticleSectionImageSet_article$data
  hideImage?: boolean
}

const MINI_IMAGE_ASPECT_RATIO = 0.787

const LayoutMini: React.FC<LayoutProps> = ({ section, article, hideImage }) => {
  if (section.cover?.__typename === "%other" || !section.cover?.image?.url || !article) {
    return null
  }

  const cover = section.cover

  return (
    <RouterLink
      to={`article/${article.internalID}/slideshow`}
      navigationProps={{ coverId: cover.id }}
    >
      <Flex mx={hideImage ? 0 : 2} p={2} borderColor="mono15" borderWidth={1}>
        <Flex flexDirection="row" justifyContent="space-between">
          {!hideImage && !!cover?.image?.url && (
            <Image
              src={cover.image.url}
              aspectRatio={MINI_IMAGE_ASPECT_RATIO}
              width={60}
              testID="small-image-slideshow"
            />
          )}

          <Flex flex={1} pl={hideImage ? 0 : 2} flexDirection="row" alignItems="center">
            <Flex flex={1} pr={2}>
              <Text variant="sm-display">{section.title}</Text>
              <Text variant="sm-display" color="mono60">
                View Slideshow
              </Text>
            </Flex>

            <ImageSetIcon />
          </Flex>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const FULL_IMAGE_ASPECT_RATIO = 1.56

const LayoutFull: React.FC<LayoutProps> = ({ section, article, hideImage }) => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  if (section.cover?.__typename === "%other" || !section.cover?.image?.url || !article) {
    return null
  }

  const cover = section.cover

  return (
    <Flex p={2}>
      {!!cover?.image?.url && (
        <Image
          src={cover.image.url}
          aspectRatio={FULL_IMAGE_ASPECT_RATIO}
          width={width - space(4)}
          testID="image-slideshow"
        />
      )}

      <Flex
        position="absolute"
        bottom={space(4)}
        left={space(4)}
        right={space(4)}
        backgroundColor="mono0"
      >
        <LayoutMini section={section} article={article} hideImage={hideImage} />
      </Flex>
    </Flex>
  )
}
