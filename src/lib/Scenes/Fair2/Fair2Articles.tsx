import { Fair2Articles_fair } from "__generated__/Fair2Articles_fair.graphql"
import { Fair2ArticlesQuery } from "__generated__/Fair2ArticlesQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { compact } from "lodash"
import { Box, Button, Join, Message, space, Spacer, Text, Theme, Touchable } from "palette"
import React, { useState } from "react"
import { Dimensions, FlatList, ScrollView } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { Fair2EditorialShare } from "./Components/Fair2EditorialShare"

const FAIR2_ARTICLES_PAGE_SIZE = 10

interface Fair2ArticlesQueryRendererProps {
  fairID: string
}

interface Fair2ArticlesProps {
  fair: Fair2Articles_fair
  relay: RelayPaginationProp
}

export const Fair2Articles: React.FC<Fair2ArticlesProps> = ({ fair, relay }) => {
  const articles = fair.articlesConnection?.edges
  const totalCount = fair.articlesConnection?.totalCount ?? 0
  const [isLoading, setIsLoading] = useState(false)

  const handlePress = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }

    setIsLoading(true)

    relay.loadMore(FAIR2_ARTICLES_PAGE_SIZE, (err) => {
      setIsLoading(false)

      if (err) {
        console.error(err)
      }
    })
  }

  if (totalCount === 0) {
    return <Message>There aren’t any articles at this time.</Message>
  }

  const [{ node: heroArticle }, ...remainingArticles] = compact(articles)

  const { width: screenWidth } = Dimensions.get("screen")
  const imageWidth = screenWidth - space(4)

  return (
    <ScrollView>
      <Theme>
        <Box px={2} py={6}>
          <Text variant="largeTitle">Articles</Text>

          <Spacer my={1} />

          <Join separator={<Spacer my={3} />}>
            <Touchable
              onPress={() => {
                navigate(heroArticle!.href!)
              }}
            >
              <Box position="relative">
                <OpaqueImageView
                  width={imageWidth}
                  height={(4 / 3) * imageWidth}
                  imageURL={heroArticle!.thumbnailImage?.url}
                />

                <Box bg="white100" pt={2} px={2} width="85%" position="absolute" bottom={0} right={0}>
                  <Text variant="title" mb={1}>
                    {heroArticle!.title}
                  </Text>

                  <Text variant="caption" color="black60">
                    {heroArticle!.author?.name}
                  </Text>

                  <Text variant="caption">{heroArticle!.publishedAt}</Text>

                  <Fair2EditorialShare
                    mt={1}
                    subject={heroArticle!.title!}
                    url={`https://www.artsy.net${heroArticle!.href}`}
                  />
                </Box>
              </Box>
            </Touchable>

            <FlatList<typeof remainingArticles[number]>
              data={remainingArticles}
              keyExtractor={({ node }, i) => node?.internalID ?? `${i}`}
              ItemSeparatorComponent={() => <Spacer my={3} />}
              renderItem={({ item: { node: article } }) => {
                return (
                  <Touchable
                    onPress={() => {
                      navigate(article!.href!)
                    }}
                  >
                    <OpaqueImageView
                      width={imageWidth}
                      height={(9 / 16) * imageWidth}
                      imageURL={article!.thumbnailImage?.url}
                    />

                    <Box width="95%">
                      <Text variant="subtitle" mt={1} mb={1}>
                        {article!.title}
                      </Text>

                      <Text color="black60" variant="caption">
                        {article!.author?.name}
                      </Text>

                      <Text variant="caption">{article!.publishedAt}</Text>

                      <Fair2EditorialShare
                        mt={1}
                        subject={article!.title!}
                        url={`https://www.artsy.net${article!.href}`}
                      />
                    </Box>
                  </Touchable>
                )
              }}
            />

            {totalCount > FAIR2_ARTICLES_PAGE_SIZE && (
              <Button
                variant="secondaryGray"
                block
                width="100%"
                loading={isLoading}
                onPress={handlePress}
                disabled={!relay.hasMore()}
              >
                Show more
              </Button>
            )}
          </Join>
        </Box>
      </Theme>
    </ScrollView>
  )
}

export const FAIR2_ARTICLES_QUERY = graphql`
  query Fair2ArticlesQuery($id: String!, $first: Int!, $after: String) {
    fair(id: $id) @principalField {
      ...Fair2Articles_fair @arguments(first: $first, after: $after)
    }
  }
`

export const Fair2ArticlesPaginationContainer = createPaginationContainer(
  Fair2Articles,
  {
    fair: graphql`
      fragment Fair2Articles_fair on Fair @argumentDefinitions(first: { type: "Int" }, after: { type: "String" }) {
        slug
        articlesConnection(first: $first, after: $after) @connection(key: "Fair2ArticlesQuery_articlesConnection") {
          totalCount
          edges {
            node {
              internalID
              title
              href
              author {
                name
              }
              publishedAt(format: "MMM Do, YYYY")
              thumbnailTitle
              thumbnailImage {
                url
              }
            }
          }
        }
      }
    `,
  },
  {
    query: FAIR2_ARTICLES_QUERY,
    direction: "forward",
    getVariables({ fair: { slug: id } }, { cursor: after }, { first }) {
      return { first, after, id }
    },
  }
)

export const Fair2ArticlesQueryRenderer: React.FC<Fair2ArticlesQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<Fair2ArticlesQuery>
      environment={defaultEnvironment}
      // tslint:disable-next-line: relay-operation-generics
      query={FAIR2_ARTICLES_QUERY}
      variables={{ id: fairID, first: FAIR2_ARTICLES_PAGE_SIZE }}
      render={renderWithLoadProgress(Fair2ArticlesPaginationContainer)}
    />
  )
}
