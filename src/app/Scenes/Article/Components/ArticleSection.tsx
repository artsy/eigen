import { ArticleSectionText_article$key } from "__generated__/ArticleSectionText_article.graphql"
import { ArticleSection_section$key } from "__generated__/ArticleSection_section.graphql"
import { ArticleSectionEmbed } from "app/Scenes/Article/Components/Sections/ArticleSectionEmbed"
import { ArticleSectionImageCollection } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection"
import { ArticleSectionImageSet } from "app/Scenes/Article/Components/Sections/ArticleSectionImageSet"
import { ArticleSectionText } from "app/Scenes/Article/Components/Sections/ArticleSectionText"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionProps {
  article: ArticleSectionText_article$key
  section: ArticleSection_section$key
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({ article, section }) => {
  const data = useFragment(fragment, section)

  if (data.__typename === "ArticleSectionImageSet") {
    return null
  }

  switch (data.__typename) {
    case "ArticleSectionText":
      return <ArticleSectionText section={data} article={article} />
    case "ArticleSectionImageCollection":
      return <ArticleSectionImageCollection section={data} />
    case "ArticleSectionImageSet":
      return <ArticleSectionImageSet section={data} article={article} />
    case "ArticleSectionEmbed":
      return <ArticleSectionEmbed section={data} />
    default:
      return null
  }
}

const fragment = graphql`
  fragment ArticleSection_section on ArticleSections {
    __typename
    ...ArticleSectionImageCollection_section
    ...ArticleSectionImageSet_section
    ...ArticleSectionText_section
    ...ArticleSectionEmbed_section
  }
`
