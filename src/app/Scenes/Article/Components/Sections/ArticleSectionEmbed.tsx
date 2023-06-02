import { Text } from "@artsy/palette-mobile"
import { ArticleSectionEmbed_section$key } from "__generated__/ArticleSectionEmbed_section.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionEmbedProps {
  section: ArticleSectionEmbed_section$key
}

export const ArticleSectionEmbed: React.FC<ArticleSectionEmbedProps> = ({ section }) => {
  const data = useFragment(ArticleSectionEmbedQuery, section)

  return (
    <>
      <Text>{data.url}</Text>
      <Text>{data.height}</Text>
      <Text>{data._layout}</Text>
    </>
  )
}

const ArticleSectionEmbedQuery = graphql`
  fragment ArticleSectionEmbed_section on ArticleSectionEmbed {
    url
    height
    mobileHeight
    _layout: layout
  }
`
