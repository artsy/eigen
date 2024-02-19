import { Flex, Text } from "@artsy/palette-mobile"
import { Biography_artist$key } from "__generated__/Biography_artist.graphql"
import { HTML } from "app/Components/HTML"
import { SectionTitle } from "app/Components/SectionTitle"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"

const MAX_CHARS = 250

export const MAX_WIDTH = 650

interface BiographyProps {
  artist: Biography_artist$key
}

export const Biography: React.FC<BiographyProps> = ({ artist }) => {
  const [expanded, setExpanded] = useState(false)
  const data = useFragment(query, artist)

  if (!data || !data.biographyBlurb?.text) {
    return null
  }

  const text = data.biographyBlurb.text
  const truncatedText = text.slice(0, MAX_CHARS)
  const canExpand = text.length > MAX_CHARS

  return (
    <Flex maxWidth={MAX_WIDTH} px={2}>
      <SectionTitle title="Biography" />
      <HTML
        html={`${expanded ? text : truncatedText}${
          text.length > MAX_CHARS && !expanded ? "... " : " "
        }`}
        variant="sm"
      />

      {!!canExpand && (
        <Text underline onPress={() => setExpanded((e) => !e)} mt={-1}>
          {expanded ? "Read Less" : "Read More"}
        </Text>
      )}
    </Flex>
  )
}

const query = graphql`
  fragment Biography_artist on Artist {
    biographyBlurb(format: HTML, partnerBio: false) {
      text
    }
  }
`
