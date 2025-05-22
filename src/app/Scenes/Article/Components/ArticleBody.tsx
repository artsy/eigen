import { Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { ArticleBody_article$key } from "__generated__/ArticleBody_article.graphql"
import { FONTS, HTML } from "app/Components/HTML"
import { ArticleHero } from "app/Scenes/Article/Components/ArticleHero"
import { ArticleSection } from "app/Scenes/Article/Components/ArticleSection"
import { Fragment } from "react"
import { useFragment, graphql } from "react-relay"

interface ArticleBodyProps {
  article: ArticleBody_article$key
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({ article }) => {
  const data = useFragment(ArticleBodyQuery, article)
  const color = useColor()

  return (
    <>
      <ArticleHero article={data} />

      <Spacer y={2} />

      {data.sections.map((section, index) => {
        return (
          <Fragment key={`articleBodySection-${index}`}>
            <ArticleSection article={data} section={section} />
          </Fragment>
        )
      })}
      {!!data.authors &&
        data.authors.map((author) => {
          return (
            <Flex m={2} key={author.name}>
              <Text color="mono60">{author.name}</Text>
              <Text variant="xs" color="mono60">
                {author.bio}
              </Text>
            </Flex>
          )
        })}
      {!!data.postscript && (
        <Flex m={2}>
          <HTML
            html={data.postscript}
            tagStyles={{
              p: {
                color: color("mono60"),
                fontFamily: FONTS.italic,
              },
            }}
          />
        </Flex>
      )}
    </>
  )
}

const ArticleBodyQuery = graphql`
  fragment ArticleBody_article on Article {
    ...ArticleHero_article
    ...ArticleSectionText_article
    ...ArticleSectionImageSet_article
    sections {
      ...ArticleSection_section
    }
    postscript
    authors {
      name
      bio
    }
  }
`
