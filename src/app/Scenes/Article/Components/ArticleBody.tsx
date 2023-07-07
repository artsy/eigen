import { Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { ArticleBody_article$key } from "__generated__/ArticleBody_article.graphql"
import { FONTS, HTML } from "app/Components/HTML"
import { ArticleHero } from "app/Scenes/Article/Components/ArticleHero"
import { ArticleSectionImageCollection } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection"
import { ArticleSectionText } from "app/Scenes/Article/Components/Sections/ArticleSectionText"
import { Fragment } from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

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
            <ArticleSectionImageCollection section={section} />
            <ArticleSectionText
              section={section}
              internalID={data.internalID}
              slug={data.slug ?? ""}
              px={2}
            />
          </Fragment>
        )
      })}
      {!!data.authors &&
        data.authors.map((author) => {
          return (
            <Flex m={2} key={author.name}>
              <Text color="black60">{author.name}</Text>
              <Text variant="xs" color="black60">
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
                color: color("black60"),
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

    sections {
      ...ArticleSectionImageCollection_section
      ...ArticleSectionText_section
    }
    postscript
    authors {
      name
      bio
    }
    internalID
    slug
  }
`
