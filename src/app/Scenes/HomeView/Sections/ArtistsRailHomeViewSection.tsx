import { Flex } from "@artsy/palette-mobile"
import { ArtistsRailHomeViewSection_section$key } from "__generated__/ArtistsRailHomeViewSection_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { View } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ArtworksRailHomeViewSectionProps {
  section: ArtistsRailHomeViewSection_section$key
}

export const ArtistsRailHomeViewSection: React.FC<ArtworksRailHomeViewSectionProps> = ({
  section,
}) => {
  const data = useFragment(fragment, section)
  const title = data.component?.title
  const artists = extractNodes(data.artistsConnection)

  if (artists.length === 0) return null

  return (
    <Flex>
      <View>
        <Flex pl={2} pr={2}>
          <SectionTitle title={title} />
        </Flex>
      </View>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtistsRailHomeViewSection_section on ArtistsRailHomeViewSection {
    component {
      title
    }

    artistsConnection(first: 10) {
      edges {
        node {
          internalID
          name
        }
      }
    }
  }
`
