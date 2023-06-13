import { ArticleSectionText_section$key } from "__generated__/ArticleSectionText_section.graphql"
import { HTML } from "app/Components/HTML"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionTextProps {
  section: ArticleSectionText_section$key
}

export const ArticleSectionText: React.FC<ArticleSectionTextProps> = ({ section }) => {
  const data = useFragment(ArticleSectionTextQuery, section)

  if (!data.body) {
    return null
  }

  return <HTML html={data.body} />
}

const ArticleSectionTextQuery = graphql`
  fragment ArticleSectionText_section on ArticleSectionText {
    body
  }
`
