import { ActionType, ContextModule, OwnerType, TappedArticleGroup } from "@artsy/cohesion"
import { Flex, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { Articles_articles$key } from "__generated__/Articles_articles.graphql"
import { Articles_artist$key } from "__generated__/Articles_artist.graphql"
import { MasonryStatic } from "app/Components/MasonryStatic"
import { navigate } from "app/system/navigation/navigate"
import { Dimensions } from "react-native"
import { useFragment, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { Article } from "./Article"

interface Props {
  articles: Articles_articles$key
  artist: Articles_artist$key
}

export const Articles: React.FC<Props> = ({ articles, artist }) => {
  const tracking = useTracking()
  const articlesData = useFragment(articlesQuery, articles)
  const artistData = useFragment(artistQuery, artist)

  const handleViewAll = () => {
    tracking.trackEvent(tracks.tappedViewAll())
    navigate(`artist/${artistData.slug}/articles`)
  }

  return (
    <Flex px={2}>
      <Flex flexDirection="row" justifyContent="space-between">
        <Flex flex={1}>
          <Text
            variant="sm-display"
            numberOfLines={2}
            ellipsizeMode="tail"
            // Avoid having the title and the view all button getting too close
            pr={1}
          >{`Artsy Editorial Featuring ${artistData.name}`}</Text>
        </Flex>
        <Touchable onPress={handleViewAll}>
          <Text variant="xs" underline>
            View All
          </Text>
        </Touchable>
      </Flex>

      <Spacer y={4} />

      <Article article={articlesData[0]} artist={artistData} headline />

      <Spacer y={2} />

      <Flex flex={1} flexShrink={0} flexGrow={1}>
        <MasonryStatic
          data={articlesData.slice(1, articlesData.length)}
          renderItem={({ item }) => <Article article={item} artist={artistData} />}
          columnSeparator={() => <Spacer x={2} />}
          numColumns={Dimensions.get("window").width > 700 ? 3 : 2}
          columnKey="articles"
        />
      </Flex>
    </Flex>
  )
}

const articlesQuery = graphql`
  fragment Articles_articles on Article @relay(plural: true) {
    internalID
    ...ArticleCard_article
    ...Article_article
  }
`

const artistQuery = graphql`
  fragment Articles_artist on Artist {
    name
    slug
    ...Article_artist
  }
`

const tracks = {
  tappedViewAll: (): TappedArticleGroup => ({
    action: ActionType.tappedArticleGroup,
    context_module: ContextModule.marketNews,
    context_screen_owner_type: OwnerType.artist,
    destination_screen_owner_type: OwnerType.articles,
    type: "viewAll",
  }),
}
