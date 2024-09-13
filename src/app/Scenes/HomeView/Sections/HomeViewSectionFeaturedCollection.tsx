import {
  Flex,
  Image,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { HomeViewSectionFeaturedCollectionQuery } from "__generated__/HomeViewSectionFeaturedCollectionQuery.graphql"
import { HomeViewSectionFeaturedCollection_section$key } from "__generated__/HomeViewSectionFeaturedCollection_section.graphql"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "app/Components/ArtworkRail/ArtworkRailCard"
import {
  LARGE_RAIL_IMAGE_WIDTH,
  LargeArtworkRail,
} from "app/Components/ArtworkRail/LargeArtworkRail"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { TouchableOpacity, useWindowDimensions } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionFeaturedCollectionProps {
  section: HomeViewSectionFeaturedCollection_section$key
}

const HEADER_IMAGE_HEIGHT = 80

export const HomeViewSectionFeaturedCollection: React.FC<
  HomeViewSectionFeaturedCollectionProps
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
    <Flex pb={2} backgroundColor="black100" my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {!!component.backgroundImageURL && (
          <Image
            width={width}
            height={HEADER_IMAGE_HEIGHT}
            resizeMode="cover"
            src={component.backgroundImageURL}
          />
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
  fragment HomeViewSectionFeaturedCollection_section on HomeViewSectionArtworks {
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

const HomeViewSectionFeaturedCollectionPlaceholder: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonBox>
        <SkeletonBox height={HEADER_IMAGE_HEIGHT} />

        <Flex mx={2} mt={2}>
          <SkeletonText color="white100" variant="lg-display" mb={0.5}>
            Section Title
          </SkeletonText>
          <SkeletonText color="white100" variant="xs">
            Description of the section
          </SkeletonText>
        </Flex>

        <Spacer y={4} />

        <Flex flexDirection="row">
          <Join separator={<Spacer x="15px" />}>
            <Flex>
              <SkeletonBox
                height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT.large}
                width={LARGE_RAIL_IMAGE_WIDTH}
              />
              <Spacer y={2} />
              <SkeletonText>Andy Warhold</SkeletonText>
              <SkeletonText>A creative name for a work</SkeletonText>
              <SkeletonText>Gallery or Partner</SkeletonText>
              <SkeletonText>1000 €</SkeletonText>
            </Flex>
          </Join>
        </Flex>
      </SkeletonBox>
    </Skeleton>
  )
}

const homeViewSectionFeaturedCollectionQuery = graphql`
  query HomeViewSectionFeaturedCollectionQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionFeaturedCollection_section
      }
    }
  }
`

export const HomeViewSectionFeaturedCollectionQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionFeaturedCollectionQuery>(
    homeViewSectionFeaturedCollectionQuery,
    {
      id: props.sectionID,
    }
  )

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionFeaturedCollection section={data.homeView.section} />
}, HomeViewSectionFeaturedCollectionPlaceholder)
