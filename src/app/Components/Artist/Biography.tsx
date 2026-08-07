import { Biography_artist$key } from "__generated__/Biography_artist.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { graphql, useFragment } from "react-relay"

export const MAX_CHARS = 250
export const MAX_WIDTH_BIO = 650

interface BiographyProps {
  artist: Biography_artist$key
  variant?: "sm" | "xs"
}

export const Biography: React.FC<BiographyProps> = ({ artist, variant = "sm" }) => {
  const data = useFragment(query, artist)

  if (!data || !data.biographyBlurb?.text) {
    return null
  }

  const credit = data.biographyBlurb.credit
  const text = !!credit ? `${data.biographyBlurb.text} ${credit}` : data.biographyBlurb.text

  return (
    <ReadMore
      content={text}
      maxChars={MAX_CHARS}
      textVariant={variant}
      linkTextVariant={variant}
      showReadLessButton
    />
  )
}

const query = graphql`
  fragment Biography_artist on Artist {
    biographyBlurb(format: MARKDOWN) {
      text
      credit
    }
  }
`
