import { Flex } from "@artsy/palette-mobile"
import { ArtworksRailHomeViewSection_section$key } from "__generated__/ArtworksRailHomeViewSection_section.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { View } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ArtworksRailHomeViewSectionProps {
  section: ArtworksRailHomeViewSection_section$key
}

export const ArtworksRailHomeViewSection: React.FC<ArtworksRailHomeViewSectionProps> = ({
  section,
}) => {
  const data = useFragment(fragment, section)

  const artworks = extractNodes(data.artworksConnection)

  if (!data.component || !artworks || artworks.length === 0) {
    return null
  }

  const { title, href } = data.component

  const handleOnArtworkPress = (artwork: any, _position: any) => {
    navigate(artwork.href)
  }

  return (
    <Flex>
      <View>
        <Flex pl={2} pr={2}>
          <SectionTitle title={title} {...(href ? { onPress: () => navigate(href) } : {})} />
        </Flex>
        <LargeArtworkRail
          artworks={artworks}
          onPress={handleOnArtworkPress}
          showSaveIcon
          {...(href ? { onMorePress: () => navigate(href) } : {})}
        />
      </View>
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtworksRailHomeViewSection_section on ArtworksRailHomeViewSection {
    component {
      href
      title
    }

    artworksConnection(first: 10) {
      edges {
        node {
          ...LargeArtworkRail_artworks
        }
      }
    }
  }
`
