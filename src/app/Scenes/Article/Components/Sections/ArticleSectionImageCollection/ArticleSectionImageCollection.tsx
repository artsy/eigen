import { Text } from "@artsy/palette-mobile"
import { ArticleSectionImageCollection_section$key } from "__generated__/ArticleSectionImageCollection_section.graphql"
import { ArticleSectionImageCollectionCaption } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionCaption"
import { ArticleSectionImageCollectionImage } from "app/Scenes/Article/Components/Sections/ArticleSectionImageCollection/ArticleSectionImageCollectionImage"
import { Fragment } from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionImageCollectionProps {
  section: ArticleSectionImageCollection_section$key
}

export const ArticleSectionImageCollection: React.FC<ArticleSectionImageCollectionProps> = ({
  section,
}) => {
  const data = useFragment(ArticleSectionImageCollectionQuery, section)

  return (
    <>
      <Text>{data.layout}</Text>

      {data.figures.map((figure, index) => {
        return (
          <Fragment key={index}>
            <ArticleSectionImageCollectionImage figure={figure} />
            <ArticleSectionImageCollectionCaption figure={figure} />
          </Fragment>
        )
      })}
    </>
  )
}

const ArticleSectionImageCollectionQuery = graphql`
  fragment ArticleSectionImageCollection_section on ArticleSectionImageCollection {
    layout
    figures {
      __typename
      ...ArticleSectionImageCollectionImage_figure
      ...ArticleSectionImageCollectionCaption_figure
    }
  }
`
