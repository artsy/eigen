import { Flex, Text } from "@artsy/palette-mobile"
import { Biography_artist$key } from "__generated__/Biography_artist.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import React, { useState } from "react"
import { graphql, useFragment } from "react-relay"

const MAX_CHARS = 250

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
    <Flex maxWidth={650}>
      <SectionTitle title="Biography" />
      <Text>
        <Text>{`${expanded ? text : truncatedText}${
          text.length > MAX_CHARS && !expanded ? "... " : " "
        }`}</Text>

        {!!canExpand && (
          <Text underline onPress={() => setExpanded((e) => !e)}>
            {expanded ? "Read Less" : "Read More"}
          </Text>
        )}
      </Text>
    </Flex>
  )
}

const query = graphql`
  fragment Biography_artist on Artist {
    biographyBlurb(format: PLAIN, partnerBio: false) {
      text
    }
  }
`
