import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Chip, Flex, Skeleton, SkeletonBox, Spacer, useSpace } from "@artsy/palette-mobile"
import { HomeViewSectionCardsChipsQuery } from "__generated__/HomeViewSectionCardsChipsQuery.graphql"
import { HomeViewSectionCardsChips_section$key } from "__generated__/HomeViewSectionCardsChips_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { getSnapToOffsets } from "app/Scenes/CollectionsByCategory/CollectionsChips"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionCardsChipsProps {
  section: HomeViewSectionCardsChips_section$key
  index: number
}

const CHIP_WIDTH = 230

export const HomeViewSectionCardsChips: React.FC<HomeViewSectionCardsChipsProps> = ({
  section: sectionProp,
  index,
}) => {
  const space = useSpace()
  const tracking = useHomeViewTracking()
  const section = useFragment(fragment, sectionProp)
  const cards = extractNodes(section.cardsConnection)

  if (cards.length === 0) return null

  const numRows = !isTablet() ? 3 : 2
  const numColumns = Math.ceil(cards.length / 3)
  const rows = getColumns(cards, numRows, numColumns)
  const snapToOffsets = getSnapToOffsets(numColumns, space(1), space(1), CHIP_WIDTH)

  const handleOnChipPress = (card: (typeof cards)[number], index: number) => {
    if (card.href) {
      tracking.tappedCardGroup(
        card.entityID,
        card.entityType as ScreenOwnerType,
        card.href,
        section.contextModule as ContextModule,
        index
      )
      navigate(card.href)
    }
  }

  return (
    <Flex py={2}>
      <Flex px={2}>
        <SectionTitle title={section.component?.title} />
      </Flex>

      <FlatList
        horizontal
        pagingEnabled
        snapToEnd={false}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={rows}
        keyExtractor={(item, index) => `item_${index}_${item[0].entityID}`}
        renderItem={({ item }) => (
          <Flex gap={1}>
            {item.map((item, index) => {
              if (!item?.title) return null

              return (
                <Flex minWidth={CHIP_WIDTH} key={`collectionChips-row-${index}`}>
                  <Chip
                    key={item.href}
                    title={item.title}
                    subtitle={item.subtitle as string | undefined}
                    onPress={() => handleOnChipPress(item, index)}
                  />
                </Flex>
              )
            })}
          </Flex>
        )}
      />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionCardsChips_section on HomeViewSectionCards {
    __typename
    internalID
    contextModule
    ownerType
    component {
      title
    }
    cardsConnection {
      edges {
        node {
          entityID @required(action: NONE)
          entityType @required(action: NONE)
          title
          subtitle
          href
        }
      }
    }
  }
`

const HomeViewSectionCardsChipsPlaceholder: React.FC = () => {
  const space = useSpace()

  const listSize = 9
  const numColumns = Math.ceil(listSize / 3)

  return (
    <Skeleton>
      <Flex py={2} testID="HomeViewSectionCardsChipsPlaceholder">
        <Flex px={2}>
          <SectionTitle title="Discover Something New" />
        </Flex>

        <FlatList
          scrollEnabled={false}
          columnWrapperStyle={{ paddingHorizontal: space(2) }}
          ItemSeparatorComponent={() => <Spacer y={1} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={numColumns}
          data={Array.from({ length: listSize })}
          renderItem={() => (
            <Flex width={250} marginRight="10px">
              <SkeletonBox height={60} borderRadius="5px" />
            </Flex>
          )}
        />
      </Flex>
    </Skeleton>
  )
}

const query = graphql`
  query HomeViewSectionCardsChipsQuery($id: String!, $isEnabled: Boolean!) {
    homeView {
      section(id: $id) @include(if: $isEnabled) {
        ...HomeViewSectionCardsChips_section
      }
    }
  }
`

export const HomeViewSectionCardsChipsQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const isEnabled = useFeatureFlag("AREnableMarketingCollectionsCategories")
    const data = useLazyLoadQuery<HomeViewSectionCardsChipsQuery>(query, {
      id: sectionID,
      isEnabled,
    })

    if (!data?.homeView.section || !isEnabled) {
      return null
    }

    return (
      <HomeViewSectionCardsChips section={data.homeView.section} index={index} {...flexProps} />
    )
  },
  LoadingFallback: HomeViewSectionCardsChipsPlaceholder,
  ErrorFallback: NoFallback,
})

const getColumns = <T extends Object>(data: T[], numRows: number, numColumns: number): T[][] => {
  const rows: T[][] = Array.from({ length: numColumns }, () => [])

  for (let i = 0; i < numRows * numColumns; i++) {
    rows[i % numColumns].push(data[i])
  }

  return rows
}
