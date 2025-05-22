import { ActionType, ContextModule, OwnerType, TappedArticleGroup } from "@artsy/cohesion"
import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { Article_article$data, Article_article$key } from "__generated__/Article_article.graphql"
import { Article_artist$data, Article_artist$key } from "__generated__/Article_artist.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import FastImage from "react-native-fast-image"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArticleProps {
  article: Article_article$key
  artist: Article_artist$key
  headline?: boolean
}

export const Article: React.FC<ArticleProps> = ({ article, artist, headline = false }) => {
  const articleData = useFragment(articleQuery, article)
  const artistData = useFragment(artistQuery, artist)
  const tracking = useTracking()

  const handleOnPress = () => {
    if (articleData.href) {
      tracking.trackEvent(tracks.tappedArticleGroup(articleData, artistData))
    }
  }

  return (
    <RouterLink onPress={handleOnPress} to={articleData.href}>
      <Flex width="100%" overflow="hidden">
        <Flex width="100%" style={{ aspectRatio: 1.5 }}>
          {/* TODO: palette Image doesn't work with percentages, we can change it
              as soon as the palette element works
           */}
          <FastImage
            source={{ uri: articleData.thumbnailImage?.url ?? "" }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
        </Flex>
        <Spacer y={1} />
        <Text variant="xs" color="mono100">
          {articleData.vertical}
        </Text>
        <Spacer y={1} />
        <Text variant={headline ? "lg-display" : "sm-display"}>{articleData.thumbnailTitle}</Text>
        <Spacer y={1} />
        <Text variant="xs" color="mono60">{`By ${articleData.byline}`}</Text>
        {!headline && <Spacer y={4} />}
      </Flex>
    </RouterLink>
  )
}

const articleQuery = graphql`
  fragment Article_article on Article {
    internalID
    slug
    href
    thumbnailImage {
      url(version: "large")
    }
    thumbnailTitle
    vertical
    byline
  }
`

const artistQuery = graphql`
  fragment Article_artist on Artist {
    internalID
    slug
  }
`

const tracks = {
  tappedArticleGroup: (
    article: Article_article$data,
    artist: Article_artist$data
  ): TappedArticleGroup => ({
    action: ActionType.tappedArticleGroup,
    context_module: ContextModule.marketNews,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artist.internalID,
    context_screen_owner_slug: artist.slug,
    destination_screen_owner_type: OwnerType.article,
    destination_screen_owner_id: article.internalID,
    destination_screen_owner_slug: article.slug ?? "",
    type: "thumbnail",
  }),
}
