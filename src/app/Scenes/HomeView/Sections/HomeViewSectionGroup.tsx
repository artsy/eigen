import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { ChevronRightIcon } from "@artsy/icons/native"
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
import { HomeViewSectionGroupQuery } from "__generated__/HomeViewSectionGroupQuery.graphql"
import {
  HomeViewSectionGroup_section$data,
  HomeViewSectionGroup_section$key,
} from "__generated__/HomeViewSectionGroup_section.graphql"
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

type Chip = NonNullable<
  NonNullable<
    NonNullable<NonNullable<HomeViewSectionGroup_section$data["chipsConnection"]>["edges"]>[number]
  >["node"]
>

interface HomeViewSectionGroupProps extends FlexProps {
  section: HomeViewSectionGroup_section$key
  index: number
}

export const HomeViewSectionGroup: React.FC<HomeViewSectionGroupProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const section = useFragment(fragment, sectionProp)
  const tracking = useHomeViewTracking()

  const contextModule = section.contextModule as ContextModule
  const chips = extractNodes(section.chipsConnection)

  // Background tint is server-driven (null → untinted). The editorial area (an articles
  // rail) still drives the chip presentation: news cards vs collection cards.
  const backgroundColor = section.backgroundColor ?? undefined
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
    <Flex {...flexProps} backgroundColor={backgroundColor} py={backgroundColor ? 2 : undefined}>
      <SectionTitle
        mx={2}
        variant="xlarge"
        title={section.component?.title}
        subtitle={section.component?.description}
      />

      {section.rails.map((rail, railIndex) => (
        <GroupRail key={railIndex} rail={rail} containerInternalID={section.internalID} />
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
          ) : (
            // No chips header (curated area) — add breathing room so the cards don't
            // crowd the lead rail above.
            <Spacer y={4} />
          )}

          {isEditorialArea ? (
            <NewsChipRail chips={chips} onChipPress={handleChipPress} />
          ) : (
            <CollectionCardRail chips={chips} onChipPress={handleChipPress} />
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

const COLLECTION_CARD_IMAGE_HEIGHT = 190

// "Curated" area chips rendered as cards: a 3-image stack (or a single image / placeholder),
// the entry title, a short description, and a chevron affordance.
const CollectionCardRail: React.FC<{
  chips: Chip[]
  onChipPress: (chip: Chip, index: number) => void
}> = ({ chips, onChipPress }) => {
  const { width } = useScreenDimensions()
  const cardWidth = width * 0.75

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={chips}
      keyExtractor={(item, index) => item.entityID ?? String(index)}
      ListHeaderComponent={() => <Spacer x={2} />}
      ListFooterComponent={() => <Spacer x={2} />}
      ItemSeparatorComponent={() => <Spacer x={2} />}
      renderItem={({ item, index }) => (
        <CollectionCard
          chip={item}
          width={cardWidth}
          cardIndex={index}
          onPress={() => onChipPress(item, index)}
        />
      )}
    />
  )
}

// Each image's height as a fraction of the stack height, ordered left → right. All variants
// share the same geometry — same width, bottom-aligned, stepping right, leftmost on top — and
// differ only in the height silhouette. The 3-image stack cycles these by card index so the
// rail shows the design's varied fans (ascending / descending / tall-sides / tall-middle);
// 1–2 image stacks use a fixed shape.
const THREE_IMAGE_STACK_VARIANTS: number[][] = [
  [0.63, 0.82, 1], // ascending — tall on the right
  [1, 0.82, 0.63], // descending — tall on the left
  [1, 0.65, 1], // bookends — tall on the sides
  [0.65, 1, 0.65], // peak — tall in the middle
]

const stackHeightFractions = (count: number, cardIndex: number): number[] => {
  if (count >= 3) {
    return THREE_IMAGE_STACK_VARIANTS[cardIndex % THREE_IMAGE_STACK_VARIANTS.length]
  }
  return count === 2 ? [0.78, 1] : [1]
}

const CollectionImageStack: React.FC<{ urls: string[]; width: number; cardIndex: number }> = ({
  urls,
  width,
  cardIndex,
}) => {
  const imageWidth = width * 0.55
  const stepX = urls.length > 1 ? (width - imageWidth) / (urls.length - 1) : 0
  const fractions = stackHeightFractions(urls.length, cardIndex)

  return (
    <Flex width={width} height={COLLECTION_CARD_IMAGE_HEIGHT}>
      {urls.map((url, index) => (
        // Positioning lives on this wrapper (a plain view reliably honors absolute
        // layout); palette Image forwards `style` to its inner node, so putting
        // position on the Image itself would leave the images in normal flow.
        <Flex
          key={index}
          position="absolute"
          borderRadius={6}
          borderWidth={2}
          borderColor="mono0"
          overflow="hidden"
          style={{ left: index * stepX, bottom: 0, zIndex: urls.length - index }}
        >
          <Image
            testID="collection-card-stack-image"
            src={url}
            width={imageWidth}
            height={COLLECTION_CARD_IMAGE_HEIGHT * (fractions[index] ?? 1)}
          />
        </Flex>
      ))}
    </Flex>
  )
}

const CollectionCard: React.FC<{
  chip: Chip
  width: number
  cardIndex: number
  onPress: () => void
}> = ({ chip, width, cardIndex, onPress }) => {
  const color = useColor()
  const imageURL = chip.image?.imageURL
  const stackURLs = (chip.images ?? [])
    .map((image) => image?.imageURL)
    .filter((url): url is string => !!url)
    .slice(0, 3)

  return (
    <RouterLink to={chip.href} onPress={onPress}>
      <Flex width={width}>
        {stackURLs.length > 0 ? (
          <CollectionImageStack urls={stackURLs} width={width} cardIndex={cardIndex} />
        ) : imageURL ? (
          <Image
            testID="collection-card-image"
            src={imageURL}
            width={width}
            height={COLLECTION_CARD_IMAGE_HEIGHT}
            style={{ borderRadius: 6 }}
          />
        ) : (
          <Flex
            testID="collection-card-image"
            width={width}
            height={COLLECTION_CARD_IMAGE_HEIGHT}
            backgroundColor={color("mono10")}
            borderRadius={6}
          />
        )}

        <Flex flexDirection="row" alignItems="center" mt={1}>
          <Flex flex={1} mr={1}>
            <Text variant="sm-display">{chip.title}</Text>
            {!!chip.subtitle && (
              <Text variant="xs" color="mono60" numberOfLines={2}>
                {chip.subtitle}
              </Text>
            )}
          </Flex>

          <Flex
            width={40}
            height={40}
            borderRadius={20}
            borderWidth={1}
            borderColor="mono10"
            alignItems="center"
            justifyContent="center"
          >
            <ChevronRightIcon width={18} height={18} />
          </Flex>
        </Flex>
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

type GroupRailData = HomeViewSectionGroup_section$data["rails"][number]

// Renders one rail of a section group as a bare rail component — NOT via the
// standalone <HomeViewSection…>, whose own internalID would be absent from the
// FlatList's viewableSections and silently break impressions (those anchor on the
// container's internalID here). `rail.title` overrides the section's own title so
// block copy can diverge from the standalone rail; when set, the subtitle is
// suppressed to avoid repeating the container tagline. Shows self-fetch
// location-based data via ShowsRailContainer (same as the standalone Shows section).
// Unsupported section types render nothing.
const GroupRail: React.FC<{
  rail: GroupRailData
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
          variant="large"
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
        titleVariant="large"
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
          variant="large"
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
        titleVariant="large"
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
  fragment HomeViewSectionGroup_section on HomeViewSectionGroup
  @argumentDefinitions(enableHidingDislikedArtworks: { type: "Boolean", defaultValue: false }) {
    __typename
    internalID
    contextModule
    backgroundColor
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
          subtitle
          href
          entityID
          entityType
          contextModule
          image {
            imageURL
          }
          images {
            imageURL
          }
        }
      }
    }
  }
`

const homeViewSectionGroupQuery = graphql`
  query HomeViewSectionGroupQuery($id: String!, $enableHidingDislikedArtworks: Boolean!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionGroup_section
          @arguments(enableHidingDislikedArtworks: $enableHidingDislikedArtworks)
      }
    }
  }
`

export const HomeViewSectionGroupQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const enableHidingDislikedArtworks = useFeatureFlag("AREnableHidingDislikedArtworks")

    const data = useLazyLoadQuery<HomeViewSectionGroupQuery>(
      homeViewSectionGroupQuery,
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

    return <HomeViewSectionGroup section={data.homeView.section} index={index} {...flexProps} />
  },
  LoadingFallback: ArtworkRailPlaceholder,
  ErrorFallback: NoFallback,
})
