import { Flex } from "@artsy/palette-mobile"
import { NewWorksForYouSection_section$key } from "__generated__/NewWorksForYouSection_section.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { View } from "react-native"
import { graphql, useFragment } from "react-relay"

interface NewWorksForYouSectionProps {
  section: NewWorksForYouSection_section$key
}

export const NewWorksForYouSection: React.FC<NewWorksForYouSectionProps> = ({ section }) => {
  const data = useFragment(fragment, section)
  const title = data.title
  const artworks = extractNodes(data.artworksConnection)

  if (!artworks) return null

  const handleOnArtworkPress = (artwork: any, _position: any) => {
    navigate(artwork.href)
  }

  return (
    <Flex>
      <View>
        <Flex pl={2} pr={2}>
          <SectionTitle
            title={title}
            onPress={() => {
              navigate("/new-for-you")
            }}
          />
        </Flex>
        <LargeArtworkRail
          artworks={artworks}
          onPress={handleOnArtworkPress}
          showSaveIcon
          onMorePress={() => {
            navigate("/new-for-you")
          }}
        />
      </View>
    </Flex>
  )
}

const fragment = graphql`
  fragment NewWorksForYouSection_section on ArtworksRailHomeViewSection {
    title

    artworksConnection(first: 10) {
      edges {
        node {
          ...LargeArtworkRail_artworks
        }
      }
    }
  }
`
