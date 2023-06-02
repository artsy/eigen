import { Text } from "@artsy/palette-mobile"
import { ArticleSectionText_section$key } from "__generated__/ArticleSectionText_section.graphql"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionTextProps {
  section: ArticleSectionText_section$key
}

export const ArticleSectionText: React.FC<ArticleSectionTextProps> = ({ section }) => {
  const data = useFragment(ArticleSectionTextQuery, section)
  return <Text>{data.body}</Text>
}

const ArticleSectionTextQuery = graphql`
  fragment ArticleSectionText_section on ArticleSectionText {
    body
  }
`
