import { Flex, FlexProps } from "@artsy/palette-mobile"
import { ArticleSectionText_section$key } from "__generated__/ArticleSectionText_section.graphql"
import { HTML } from "app/Components/HTML"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArticleSectionTextProps extends FlexProps {
  section: ArticleSectionText_section$key
}

export const ArticleSectionText: React.FC<ArticleSectionTextProps> = ({
  section,
  ...flexProps
}) => {
  const data = useFragment(ArticleSectionTextQuery, section)

  if (!data.body) {
    return null
  }

  return (
    <Flex {...flexProps}>
      <HTML html={data.body} />
    </Flex>
  )
}

const ArticleSectionTextQuery = graphql`
  fragment ArticleSectionText_section on ArticleSectionText {
    body
  }
`
