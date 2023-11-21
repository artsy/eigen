import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { ArticleSlideShowQuery } from "__generated__/ArticleSlideShowQuery.graphql"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArticleSlideShow } from "./Components/ArticleSlideShow"

interface ArticleSlideShowProps {
  articleID: string
  coverId: string
}

export const SlideShow: React.FC<ArticleSlideShowProps> = ({ articleID, coverId }) => {
  const data = useLazyLoadQuery<ArticleSlideShowQuery>(query, { articleID })

  if (!data?.article) {
    return null
  }

  return <ArticleSlideShow article={data.article} coverId={coverId} />
}

export const ArticlesSlideShowScreen: React.FC<ArticleSlideShowProps> = (props) => {
  return (
    <Screen>
      <Screen.Body fullwidth>
        <Suspense
          fallback={
            <Flex flex={1} justifyContent="center" alignItems="center">
              <Spinner />
            </Flex>
          }
        >
          <SlideShow {...props} />
        </Suspense>
      </Screen.Body>
    </Screen>
  )
}

const query = graphql`
  query ArticleSlideShowQuery($articleID: String!) {
    article(id: $articleID) {
      ...ArticleSlideShow_article
    }
  }
`
