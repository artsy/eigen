import { Flex, Image, Spacer, Text } from "@artsy/palette-mobile"
import { FeaturedCollectionHomeViewSection_section$key } from "__generated__/FeaturedCollectionHomeViewSection_section.graphql"
import { LargeArtworkRail } from "app/Components/ArtworkRail/LargeArtworkRail"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { TouchableOpacity, useWindowDimensions } from "react-native"
import { graphql, useFragment } from "react-relay"

interface FeaturedCollectionHomeViewSectionProps {
  section: FeaturedCollectionHomeViewSection_section$key
}

export const FeaturedCollectionHomeViewSection: React.FC<
  FeaturedCollectionHomeViewSectionProps
> = ({ section }) => {
  const { width } = useWindowDimensions()
  const data = useFragment(fragment, section)
  const component = data.component
  const componentHref = component?.behaviors?.viewAll?.href

  if (!component) return null

  const artworks = extractNodes(data.artworksConnection)
  if (!artworks || artworks.length === 0) return null

  const handlePress = () => {
    if (componentHref) {
      navigate(componentHref)
    }
  }

  const handleOnArtworkPress = (artwork: any, _position: any) => {
    navigate(artwork.href)
  }

  return (
    <Flex pb={2} backgroundColor="black100">
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {!!component.backgroundImageURL && (
          <Image width={width} height={80} resizeMode="cover" src={component.backgroundImageURL} />
        )}
        <Flex mx={2} mt={2}>
          <Text color="white100" variant="lg-display" mb={0.5}>
            {component.title}
          </Text>
          <Text color="white100" variant="xs">
            {component.description}
          </Text>
        </Flex>
      </TouchableOpacity>

      <Spacer y={4} />

      <LargeArtworkRail
        dark
        showPartnerName
        artworks={artworks}
        showSaveIcon
        onPress={handleOnArtworkPress}
        onMorePress={componentHref ? handlePress : undefined}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment FeaturedCollectionHomeViewSection_section on ArtworksRailHomeViewSection {
    component {
      title
      description
      backgroundImageURL
      behaviors {
        viewAll {
          href
        }
      }
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
