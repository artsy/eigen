import { Chip, Flex, Skeleton, SkeletonBox, Spacer, useSpace } from "@artsy/palette-mobile"
import { HomeViewSectionCardsChipsQuery } from "__generated__/HomeViewSectionCardsChipsQuery.graphql"
import { HomeViewSectionCardsChips_section$key } from "__generated__/HomeViewSectionCardsChips_section.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useClientQuery } from "app/utils/useClientQuery"
import { FlatList, ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionCardsChipsProps {
  section: HomeViewSectionCardsChips_section$key
  index: number
}

const CHIP_WIDTH = 230

export const HomeViewSectionCardsChips: React.FC<HomeViewSectionCardsChipsProps> = ({
  section: sectionProp,
}) => {
  const space = useSpace()
  const section = useFragment(fragment, sectionProp)
  const links = extractNodes(section.cardsConnection)

  if (links.length === 0) return null

  const numColumns = !isTablet() ? Math.ceil(links.length / 3) : Math.ceil(links.length / 2)
  const snapToOffsets = !isTablet()
    ? [CHIP_WIDTH / 2 + CHIP_WIDTH / 4, CHIP_WIDTH * 2]
    : [CHIP_WIDTH * 3]

  return (
    <Flex p={2}>
      <Flex>
        <SectionTitle title={section.component?.title} />
      </Flex>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToEnd={false}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
      >
        <FlatList
          scrollEnabled={true}
          columnWrapperStyle={{ gap: space(1) }}
          ItemSeparatorComponent={() => <Spacer y={1} />}
          contentContainerStyle={{ gap: 40 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={numColumns}
          data={links}
          keyExtractor={(item, index) => `item_${index}_${item.entityID}`}
          renderItem={({ item }) => (
            <Flex minWidth={CHIP_WIDTH}>
              <Chip
                key={item.href}
                title={item.title}
                onPress={() => {
                  if (item?.href) navigate(item.href)
                }}
              />
            </Flex>
          )}
        />
      </ScrollView>
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
    cardsConnection(first: 10) {
      edges {
        node {
          entityID
          title
          href
        }
      }
    }
  }
`

const HomeViewSectionCardsChipsPlaceholder: React.FC = () => {
  const listSize = 9

  const numColumns = isTablet() ? Math.ceil(listSize / 2) : Math.ceil(listSize / 3)
  return (
    <Skeleton>
      <Flex pl={2}>
        <Flex>
          <SectionTitle title="Discover Something New" />
        </Flex>
        <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 10 }}
        >
          <FlatList
            scrollEnabled={true}
            contentContainerStyle={{ alignSelf: "flex-start" }}
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
        </ScrollView>
      </Flex>
    </Skeleton>
  )
}

const query = graphql`
  query HomeViewSectionCardsChipsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionCardsChips_section
      }
    }
  }
`

export const HomeViewSectionCardsChipsQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const isEnabled = useFeatureFlag("AREnableMarketingCollectionsCategories")
    const { data } = useClientQuery<HomeViewSectionCardsChipsQuery>({
      query,
      variables: { id: sectionID },
      skip: !isEnabled,
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
