import { Text } from "@artsy/palette-mobile"
import { Biography_artist$key } from "__generated__/Biography_artist.graphql"
import { HTML } from "app/Components/HTML"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"

export const MAX_CHARS = 250
export const MAX_WIDTH_BIO = 650

interface BiographyProps {
  artist: Biography_artist$key
  variant?: "sm" | "xs"
}

export const Biography: React.FC<BiographyProps> = ({ artist, variant = "sm" }) => {
  const [expanded, setExpanded] = useState(false)
  const data = useFragment(query, artist)

  if (!data || !data.biographyBlurb?.text) {
    return null
  }

  const credit = data.biographyBlurb.credit
  const text = !!credit ? `${data.biographyBlurb.text} ${credit}` : data.biographyBlurb.text
  const truncatedText = text.slice(0, MAX_CHARS)
  const canExpand = text.length > MAX_CHARS

  return (
    <>
      <HTML
        html={`${expanded ? text : truncatedText}${
          text.length > MAX_CHARS && !expanded ? "... " : " "
        }`}
        variant={variant}
      />

      {!!canExpand && (
        <Text underline onPress={() => setExpanded((e) => !e)} mt={-1} variant={variant}>
          {expanded ? "Read Less" : "Read More"}
        </Text>
      )}
    </>
  )
}

const query = graphql`
  fragment Biography_artist on Artist {
    biographyBlurb(format: HTML) {
      text
      credit
    }
  }
`
