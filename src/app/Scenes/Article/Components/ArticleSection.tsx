import { ArticleSection_section$key } from "__generated__/ArticleSection_section.graphql"
import { ArticleSectionEmbed } from "app/Scenes/Article/Components/Sections/ArticleSectionEmbed"
import { ArticleSectionImageCollection } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollection"
import { ArticleSectionImageSet } from "app/Scenes/Article/Components/Sections/ArticleSectionImageSet"
import { ArticleSectionSocialEmbed } from "app/Scenes/Article/Components/Sections/ArticleSectionSocialEmbed"
import { ArticleSectionText } from "app/Scenes/Article/Components/Sections/ArticleSectionText"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionProps {
  section: ArticleSection_section$key
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({ section }) => {
  const data = useFragment(ArticleSectionQuery, section)

  return (
    <>
      <ArticleSectionText section={data} />
      <ArticleSectionImageCollection section={data} />
      <ArticleSectionImageSet section={data} />
      <ArticleSectionSocialEmbed section={data} />
      <ArticleSectionEmbed section={data} />
    </>
  )
}

const ArticleSectionQuery = graphql`
  fragment ArticleSection_section on ArticleSections {
    __typename
    ...ArticleSectionText_section
    ...ArticleSectionImageCollection_section
    ...ArticleSectionImageSet_section
    ...ArticleSectionSocialEmbed_section
    ...ArticleSectionEmbed_section
    # ...ArticleSectionVideo_section
  }
`
