import { Text } from "@artsy/palette-mobile"
import { ArticleSectionSocialEmbed_section$key } from "__generated__/ArticleSectionSocialEmbed_section.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionSocialEmbedProps {
  section: ArticleSectionSocialEmbed_section$key
}

export const ArticleSectionSocialEmbed: React.FC<ArticleSectionSocialEmbedProps> = ({
  section,
}) => {
  const data = useFragment(ArticleSectionSocialEmbedQuery, section)

  return (
    <>
      <Text>{data.url}</Text>
      <Text>{data.embed}</Text>
    </>
  )
}

const ArticleSectionSocialEmbedQuery = graphql`
  fragment ArticleSectionSocialEmbed_section on ArticleSectionSocialEmbed {
    url
    embed
  }
`
