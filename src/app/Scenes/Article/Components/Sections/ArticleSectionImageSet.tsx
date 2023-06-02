import { Text } from "@artsy/palette-mobile"
import { ArticleSectionImageSet_section$key } from "__generated__/ArticleSectionImageSet_section.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionImageSetProps {
  section: ArticleSectionImageSet_section$key
}

export const ArticleSectionImageSet: React.FC<ArticleSectionImageSetProps> = ({ section }) => {
  const data = useFragment(ArticleSectionImageSetQuery, section)

  return (
    <>
      <Text>{data.title}</Text>
    </>
  )
}

const ArticleSectionImageSetQuery = graphql`
  fragment ArticleSectionImageSet_section on ArticleSectionImageSet {
    setLayout: layout
    title
    counts {
      figures
    }
    cover {
      __typename
      ... on ArticleImageSection {
        id
        image {
          small: cropped(width: 80, height: 80, version: ["normalized", "larger", "large"]) {
            src
            srcSet
            height
            width
          }
          large: resized(width: 1220, version: ["normalized", "larger", "large"]) {
            src
            srcSet
            height
            width
          }
        }
      }
      ... on Artwork {
        id
        image {
          small: cropped(width: 80, height: 80, version: ["normalized", "larger", "large"]) {
            src
            srcSet
            height
            width
          }
          large: resized(width: 1220, version: ["normalized", "larger", "large"]) {
            src
            srcSet
            height
            width
          }
        }
      }
    }
  }
`
