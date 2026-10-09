import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  FlexProps,
  Image,
  Separator,
  Spacer,
  Text,
  useColor,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { HomeViewSectionCurationAreaQuery } from "__generated__/HomeViewSectionCurationAreaQuery.graphql"
import {
  HomeViewSectionCurationArea_section$data,
  HomeViewSectionCurationArea_section$key,
} from "__generated__/HomeViewSectionCurationArea_section.graphql"
import { ArtworkRail, ArtworkRailPlaceholder } from "app/Components/ArtworkRail/ArtworkRail"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { ArticlesRail } from "app/Scenes/HomeView/Components/ArticlesRail"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { ShowsRailContainer } from "app/Scenes/HomeView/Components/ShowsRail"
import { HomeViewStore } from "app/Scenes/HomeView/HomeViewContext"
import { FairCard } from "app/Scenes/HomeView/Sections/FairCard"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { getHomeViewSectionHref } from "app/Scenes/HomeView/helpers/getHomeViewSectionHref"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { useItemsImpressionsTracking } from "app/Scenes/HomeView/hooks/useImpressionsTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { isDislikeArtworksEnabledFor } from "app/utils/isDislikeArtworksEnabledFor"
import { FlatList } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

// TODO: promote to a palette token once the design system adopts it — this warm
// off-white (RGB 254, 248, 237) is the editorial curation area background and is not
// yet in @artsy/palette-mobile.
const EDITORIAL_CURATION_AREA_BACKGROUND_COLOR = "#FEF8ED"

// Presentation variants. MP sends `component.type`; the data shape is identical
// across variants, so this is a pure layout switch. Today MP only sends
// "CurationArea" (→ V2). The V1 string is TODO until that treatment lands on MP.
const CURATION_AREA_TYPE_LARGE_CHIPS = "CurationAreaLeadChipsLarge"

const CHIP_LAYOUTS = {
  // V2 (default): 3 compact chips
  compact: { thumbSize: 45 },
  // V1: 2 large chips
  large: { thumbSize: 60 },
}

type Chip = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<HomeViewSectionCurationArea_section$data["chipsConnection"]>["edges"]
    >[number]
  >["node"]
>

interface HomeViewSectionCurationAreaProps extends FlexProps {
  section: HomeViewSectionCurationArea_section$key
  index: number
}

export const HomeViewSectionCurationArea: React.FC<HomeViewSectionCurationAreaProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const section = useFragment(fragment, sectionProp)
  const tracking = useHomeViewTracking()

  const contextModule = section.contextModule as ContextModule
  const chips = extractNodes(section.chipsConnection)

  const layout =
    section.component?.type === CURATION_AREA_TYPE_LARGE_CHIPS
      ? CHIP_LAYOUTS.large
      : CHIP_LAYOUTS.compact

  // The editorial area (an articles rail) gets a tinted background and a horizontal
  // news-card rail; the artworks area keeps the default background and compact chips.
  const isEditorialArea = section.rails.some(
    (rail) => rail.section?.__typename === "HomeViewSectionArticles"
  )

  const handleChipPress = (chip: Chip, chipIndex: number) => {
    tracking.tappedCardGroup(
      chip.entityID as string,
      chip.entityType as ScreenOwnerType,
      chip.href as string,
      chip.contextModule as ContextModule,
      chipIndex
    )
  }

  return (
    <Flex
      {...flexProps}
      backgroundColor={isEditorialArea ? EDITORIAL_CURATION_AREA_BACKGROUND_COLOR : undefined}
      py={isEditorialArea ? 2 : undefined}
    >
      <SectionTitle
        mx={2}
        title={section.component?.title}
        subtitle={section.component?.description}
      />

      {section.rails.map((rail, railIndex) => (
        <CurationRail key={railIndex} rail={rail} containerInternalID={section.internalID} />
      ))}

      {chips.length > 0 && (
        <>
          {section.chipsTitle ? (
            <>
              <Separator my={2} />
              <SectionTitle
                mx={2}
                title={section.chipsTitle}
                href={section.chipsHref ?? undefined}
                onPress={
                  section.chipsHref
                    ? () =>
                        tracking.tappedCardGroupViewAll(
                          contextModule,
                          section.chipsOwnerType as ScreenOwnerType
                        )
                    : undefined
                }
              />
            </>
          ) : null}

          {isEditorialArea ? (
            <NewsChipRail chips={chips} onChipPress={handleChipPress} />
          ) : (
            <Flex flexDirection="row" flexWrap="wrap" mx={2} mt={2}>
              {chips.map((chip, chipIndex) => (
                <CurationChip
                  key={chip.entityID ?? chipIndex}
                  chip={chip}
                  thumbSize={layout.thumbSize}
                  onPress={() => handleChipPress(chip, chipIndex)}
                />
              ))}
            </Flex>
          )}
        </>
      )}

      <HomeViewSectionSentinel
        contextModule={contextModule}
        sectionType={section.__typename}
        index={index}
      />
    </Flex>
  )
}

const CurationChip: React.FC<{
  chip: Chip
  thumbSize: number
  onPress: () => void
}> = ({ chip, thumbSize, onPress }) => {
  const color = useColor()
  const imageURL = chip.image?.imageURL

  return (
    <RouterLink to={chip.href} onPress={onPress}>
      <Flex flexDirection="row" alignItems="center" mr={2} mb={1}>
        {imageURL ? (
          <Image
            testID="curation-chip-thumbnail"
            src={imageURL}
            width={thumbSize}
            height={thumbSize}
          />
        ) : (
          <Flex
            testID="curation-chip-thumbnail"
            width={thumbSize}
            height={thumbSize}
            backgroundColor={color("mono10")}
            borderRadius={2}
          />
        )}
        <Text variant="xs" ml={1}>
          {chip.title}
        </Text>
      </Flex>
    </RouterLink>
  )
}

const NEWS_CHIP_IMAGE_WIDTH = 90
const NEWS_CHIP_IMAGE_HEIGHT = 60

// Editorial "Art News" chips: a horizontal rail of bordered cards, each a thumbnail
// (image when present, placeholder otherwise) beside the article title.
const NewsChipRail: React.FC<{
  chips: Chip[]
  onChipPress: (chip: Chip, index: number) => void
}> = ({ chips, onChipPress }) => {
  const { width } = useScreenDimensions()
  const cardWidth = width * 0.82

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={chips}
      keyExtractor={(item, index) => item.entityID ?? String(index)}
      ListHeaderComponent={() => <Spacer x={2} />}
      ListFooterComponent={() => <Spacer x={2} />}
      ItemSeparatorComponent={() => <Spacer x={1} />}
      renderItem={({ item, index }) => (
        <NewsChipCard chip={item} width={cardWidth} onPress={() => onChipPress(item, index)} />
      )}
    />
  )
}

const NewsChipCard: React.FC<{
  chip: Chip
  width: number
  onPress: () => void
}> = ({ chip, width, onPress }) => {
  const color = useColor()
  const imageURL = chip.image?.imageURL

  return (
    <RouterLink to={chip.href} onPress={onPress}>
      <Flex
        flexDirection="row"
        alignItems="center"
        width={width}
        p={1}
        backgroundColor="mono0"
        borderWidth={1}
        borderColor="mono10"
        borderRadius={5}
      >
        {imageURL ? (
          <Image
            testID="news-chip-thumbnail"
            src={imageURL}
            width={NEWS_CHIP_IMAGE_WIDTH}
            height={NEWS_CHIP_IMAGE_HEIGHT}
          />
        ) : (
          <Flex
            testID="news-chip-thumbnail"
            width={NEWS_CHIP_IMAGE_WIDTH}
            height={NEWS_CHIP_IMAGE_HEIGHT}
            backgroundColor={color("mono10")}
            borderRadius={2}
          />
        )}
        <Flex flex={1} ml={1}>
          <Text variant="sm" numberOfLines={3}>
            {chip.title}
          </Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

type CurationAreaRail = HomeViewSectionCurationArea_section$data["rails"][number]

// Renders one rail of a curation area as a bare rail component — NOT via the
// standalone <HomeViewSection…>, whose own internalID would be absent from the
// FlatList's viewableSections and silently break impressions (those anchor on the
// container's internalID here). `rail.title` overrides the section's own title so
// block copy can diverge from the standalone rail; when set, the subtitle is
// suppressed to avoid repeating the container tagline. Shows self-fetch
// location-based data via ShowsRailContainer (same as the standalone Shows section).
// Unsupported section types render nothing.
const CurationRail: React.FC<{
  rail: CurationAreaRail
  containerInternalID: string
}> = ({ rail, containerInternalID }) => {
  const tracking = useHomeViewTracking()
  const viewableSections = HomeViewStore.useStoreState((state) => state.viewableSections)

  const railSection = rail.section

  const railContextModule = (
    railSection?.__typename === "HomeViewSectionArtworks" ||
    railSection?.__typename === "HomeViewSectionArticles" ||
    railSection?.__typename === "HomeViewSectionFairs" ||
    railSection?.__typename === "HomeViewSectionShows"
      ? railSection.contextModule
      : undefined
  ) as ContextModule

  const { onViewableItemsChanged, viewabilityConfig } = useItemsImpressionsTracking({
    isInViewport: viewableSections.includes(containerInternalID),
    contextModule: railContextModule,
  })

  if (railSection?.__typename === "HomeViewSectionArtworks") {
    let artworks = extractNodes(railSection.artworksConnection)

    if (isDislikeArtworksEnabledFor(railContextModule)) {
      artworks = artworks.filter((artwork) => !artwork.isDisliked)
    }

    if (!artworks.length) {
      return null
    }

    const viewAll = railSection.component?.behaviors?.viewAll
    const moreHref = getHomeViewSectionHref(viewAll?.href, {
      internalID: railSection.internalID,
      __typename: railSection.__typename,
    })

    const onMorePress = () => {
      tracking.tappedArtworkGroupViewAll(
        railContextModule,
        (viewAll?.ownerType || railSection.ownerType) as ScreenOwnerType
      )
    }

    return (
      <Flex>
        <SectionTitle
          href={moreHref}
          mx={2}
          title={rail.title ?? railSection.component?.title}
          subtitle={rail.title ? undefined : railSection.component?.description}
          onPress={moreHref ? onMorePress : undefined}
        />

        <ArtworkRail
          contextModule={railContextModule}
          contextScreenOwnerType={OwnerType.home}
          artworks={artworks}
          showSaveIcon
          moreHref={moreHref}
          onMorePress={onMorePress}
          onPress={(artwork, position) => {
            tracking.tappedArtworkGroup(
              artwork.internalID,
              artwork.slug,
              artwork.collectorSignals,
              railContextModule,
              position
            )
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </Flex>
    )
  }

  if (railSection?.__typename === "HomeViewSectionArticles") {
    if (!railSection.articlesConnection) {
      return null
    }

    const viewAll = railSection.component?.behaviors?.viewAll
    const moreHref = getHomeViewSectionHref(viewAll?.href, {
      internalID: railSection.internalID,
      __typename: railSection.__typename,
    })

    return (
      <ArticlesRail
        articlesConnection={railSection.articlesConnection}
        title={rail.title ?? railSection.component?.title ?? ""}
        subtitle={rail.title ? undefined : railSection.component?.description ?? undefined}
        titleHref={moreHref}
        onTitlePress={() => {
          tracking.tappedArticleGroupViewAll(
            railContextModule,
            (viewAll?.ownerType || railSection.ownerType) as ScreenOwnerType
          )
        }}
        onPress={(article, position) => {
          tracking.tappedArticleGroup(article.internalID, article.slug, railContextModule, position)
        }}
      />
    )
  }

  if (railSection?.__typename === "HomeViewSectionFairs") {
    const fairs = extractNodes(railSection.fairsConnection)

    if (!fairs.length) {
      return null
    }

    const viewAll = railSection.component?.behaviors?.viewAll
    let moreHref =
      viewAll &&
      getHomeViewSectionHref(viewAll?.href, {
        internalID: railSection.internalID,
        __typename: railSection.__typename,
      })

    // Mirrors HomeViewSectionFairs: the Featured Fairs instance has no server viewAll.
    if (!moreHref && railSection.internalID === "home-view-section-featured-fairs") {
      moreHref = "/featured-fairs"
    }

    const onMorePress = () => {
      tracking.tappedFairGroupViewAll(
        railContextModule,
        (viewAll?.ownerType || railSection.ownerType) as ScreenOwnerType
      )
    }

    return (
      <Flex>
        <SectionTitle
          href={moreHref || undefined}
          mx={2}
          title={rail.title ?? railSection.component?.title}
          subtitle={rail.title ? undefined : railSection.component?.description}
          onPress={moreHref ? onMorePress : undefined}
        />

        <CardRailFlatList
          data={fairs}
          initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
          windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
          renderItem={({ item, index }) => (
            <FairCard
              key={item.internalID}
              fair={item}
              onPress={(fair) => {
                tracking.tappedFairGroup(fair.internalID, fair.slug, railContextModule, index)
              }}
            />
          )}
        />
      </Flex>
    )
  }

  if (railSection?.__typename === "HomeViewSectionShows") {
    // Shows self-fetch location-based data (me.showsConnection) inside
    // ShowsRailContainer — exactly as the standalone Shows section does.
    return (
      <ShowsRailContainer
        title={rail.title ?? railSection.component?.title ?? "Shows"}
        contextModule={railContextModule}
        onTrack={(show, index) => {
          tracking.tappedShowGroup(show.internalID, show.slug, railContextModule, index)
        }}
      />
    )
  }

  return null
}

const fragment = graphql`
  fragment HomeViewSectionCurationArea_section on HomeViewSectionCurationArea
  @argumentDefinitions(enableHidingDislikedArtworks: { type: "Boolean", defaultValue: false }) {
    __typename
    internalID
    contextModule
    component {
      title
      type
      description
    }
    chipsTitle
    chipsHref
    chipsOwnerType
    ownerType
    rails {
      title
      section {
        __typename
        ... on HomeViewSectionArtworks {
          internalID
          contextModule
          ownerType
          component {
            title
            description
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
                internalID
                isDisliked @include(if: $enableHidingDislikedArtworks)
                ...ArtworkRail_artworks
              }
            }
          }
        }
        ... on HomeViewSectionArticles {
          internalID
          contextModule
          ownerType
          component {
            title
            description
            behaviors {
              viewAll {
                href
                ownerType
              }
            }
          }
          articlesConnection(first: 10) {
            ...ArticlesRail_articlesConnection
          }
        }
        ... on HomeViewSectionFairs {
          internalID
          contextModule
          ownerType
          component {
            title
            description
            behaviors {
              viewAll {
                href
                ownerType
              }
            }
          }
          fairsConnection(first: 10) {
            edges {
              node {
                href
                internalID
                slug
                ...FairCard_fair
              }
            }
          }
        }
        ... on HomeViewSectionShows {
          internalID
          contextModule
          component {
            title
          }
        }
      }
    }
    chipsConnection(first: 10) {
      edges {
        node {
          title
          href
          entityID
          entityType
          contextModule
          image {
            imageURL
          }
        }
      }
    }
  }
`

const homeViewSectionCurationAreaQuery = graphql`
  query HomeViewSectionCurationAreaQuery($id: String!, $enableHidingDislikedArtworks: Boolean!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionCurationArea_section
          @arguments(enableHidingDislikedArtworks: $enableHidingDislikedArtworks)
      }
    }
  }
`

export const HomeViewSectionCurationAreaQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const enableHidingDislikedArtworks = useFeatureFlag("AREnableHidingDislikedArtworks")

    const data = useLazyLoadQuery<HomeViewSectionCurationAreaQuery>(
      homeViewSectionCurationAreaQuery,
      {
        id: sectionID,
        enableHidingDislikedArtworks,
      },
      {
        networkCacheConfig: { force: false },
      }
    )

    if (!data.homeView.section) {
      return null
    }

    return (
      <HomeViewSectionCurationArea section={data.homeView.section} index={index} {...flexProps} />
    )
  },
  LoadingFallback: ArtworkRailPlaceholder,
  ErrorFallback: NoFallback,
})
