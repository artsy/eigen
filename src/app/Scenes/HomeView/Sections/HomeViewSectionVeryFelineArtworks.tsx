import {
  Box,
  Flex,
  FlexProps,
  Join,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { HomeViewSectionVeryFelineArtworksQuery } from "__generated__/HomeViewSectionVeryFelineArtworksQuery.graphql"
import { HomeViewSectionVeryFelineArtworks_section$key } from "__generated__/HomeViewSectionVeryFelineArtworks_section.graphql"
import { ARTWORK_RAIL_IMAGE_WIDTH, ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { ARTWORK_RAIL_CARD_IMAGE_HEIGHT } from "app/Components/ArtworkRail/LegacyArtworkRailCardImage"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { Image, TouchableOpacity } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionVeryFelineArtworksProps {
  section: HomeViewSectionVeryFelineArtworks_section$key
  index: number
}

const HEADER_IMAGE_HEIGHT = 80

const CAT_COLOR = "#d945a5"

export const HomeViewSectionVeryFelineArtworks: React.FC<
  HomeViewSectionVeryFelineArtworksProps
> = ({ section: sectionProp, ...flexProps }) => {
  const section = useFragment(fragment, sectionProp)
  const component = section.component
  if (!component) return null

  const artworks = extractNodes(section.artworksConnection)
  if (!artworks || artworks.length === 0) return null

  const viewAll = component?.behaviors?.viewAll
  const onSectionViewAll = () => {
    if (viewAll?.href) {
      navigate(viewAll.href)
    }
  }

  const handleOnArtworkPress = (artwork: any, _position: any) => {
    navigate(artwork.href)
  }

  return (
    <Flex
      {...flexProps}
      borderTopWidth={5}
      borderTopColor={CAT_COLOR}
      borderBottomWidth={5}
      borderBottomColor={CAT_COLOR}
    >
      <Flex>
        <TouchableOpacity onPress={onSectionViewAll} activeOpacity={0.7}>
          <Flex flexDirection="row">
            <Image
              style={{ width: "100%" }}
              source={require("images/careerHighlightsPromotionalCardImage.webp")}
            />
            <Box position="absolute" right={0}>
              <Text
                variant="lg-display"
                fontWeight="bold"
                color={CAT_COLOR}
                paddingTop={10}
                paddingRight={10}
              >
                {component.title}
              </Text>
            </Box>
          </Flex>
        </TouchableOpacity>

        <Spacer y={2} />

        <ArtworkRail
          showPartnerName
          artworks={artworks}
          showSaveIcon
          onPress={handleOnArtworkPress}
          onMorePress={onSectionViewAll}
        />
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionVeryFelineArtworks_section on HomeViewSectionArtworks {
    __typename
    internalID
    contextModule
    ownerType
    component {
      title
      behaviors {
        viewAll {
          href
          ownerType
        }
      }
    }

    artworksConnection(first: 10) {
      edges {
        node {
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

const HomeViewSectionVeryFelineArtworksPlaceholder: React.FC<FlexProps> = () => {
  return (
    <Skeleton>
      <SkeletonBox>
        <SkeletonBox height={HEADER_IMAGE_HEIGHT} />

        <Flex mx={2} mt={2}>
          <SkeletonText color="white100" variant="lg-display" mb={0.5}>
            Section Title
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

const homeViewSectionVeryFelineArtworksQuery = graphql`
  query HomeViewSectionVeryFelineArtworksQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionVeryFelineArtworks_section
      }
    }
  }
`

export const HomeViewSectionVeryFelineArtworksQueryRenderer: React.FC<SectionSharedProps> =
  withSuspense(({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionVeryFelineArtworksQuery>(
      homeViewSectionVeryFelineArtworksQuery,
      {
        id: sectionID,
      }
    )

    if (!data.homeView.section) {
      return null
    }

    return (
      <HomeViewSectionVeryFelineArtworks
        section={data.homeView.section}
        index={index}
        {...flexProps}
      />
    )
  }, HomeViewSectionVeryFelineArtworksPlaceholder)
