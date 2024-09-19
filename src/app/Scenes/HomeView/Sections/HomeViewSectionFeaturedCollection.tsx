import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
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
import { ARTWORK_RAIL_IMAGE_WIDTH, ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { HomeViewSectionWrapper } from "app/Scenes/HomeView/Components/HomeViewSectionWrapper"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { TouchableOpacity, useWindowDimensions } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionFeaturedCollectionProps {
  section: HomeViewSectionFeaturedCollection_section$key
}

const HEADER_IMAGE_HEIGHT = 80

export const HomeViewSectionFeaturedCollection: React.FC<HomeViewSectionFeaturedCollectionProps> = (
  props
) => {
  const { width } = useWindowDimensions()
  const tracking = useHomeViewTracking()
  const section = useFragment(fragment, props.section)
  const component = section.component
  const viewAll = component?.behaviors?.viewAll

  if (!component) return null

  const artworks = extractNodes(section.artworksConnection)
  if (!artworks || artworks.length === 0) return null

  const onSectionViewAll = () => {
    if (viewAll?.href) {
      tracking.tappedArtworkGroupViewAll(
        section.contextModule as ContextModule,
        viewAll?.ownerType as ScreenOwnerType
      )

      navigate(viewAll.href)
    } else {
      tracking.tappedArtworkGroupViewAll(
        section.contextModule as ContextModule,
        section.ownerType as ScreenOwnerType
      )

      navigate(`/home-view/sections/${section.internalID}`, {
        passProps: {
          sectionType: section.__typename,
        },
      })
    }
  }

  const handleOnArtworkPress = (artwork: any, _position: any) => {
    navigate(artwork.href)
  }

  return (
    <HomeViewSectionWrapper sectionID={section.internalID}>
      <Flex pb={2} backgroundColor="black100">
        <TouchableOpacity onPress={onSectionViewAll} activeOpacity={0.7}>
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

        <ArtworkRail
          dark
          showPartnerName
          artworks={artworks}
          showSaveIcon
          onPress={handleOnArtworkPress}
          onMorePress={onSectionViewAll}
        />
      </Flex>
    </HomeViewSectionWrapper>
  )
}

const fragment = graphql`
  fragment HomeViewSectionFeaturedCollection_section on HomeViewSectionArtworks {
    __typename
    internalID
    contextModule
    component {
      title
      description
      backgroundImageURL
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }
    ownerType

    artworksConnection(first: 10) {
      edges {
        node {
          ...ArtworkRail_artworks
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
                height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT}
                width={ARTWORK_RAIL_IMAGE_WIDTH}
              />
              <Spacer y={2} />
              <SkeletonText>Andy Warhol</SkeletonText>
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
