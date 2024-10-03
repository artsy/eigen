import { Flex, FlexProps, Skeleton, SkeletonBox, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionDiscoverMarketingCollectionsQuery } from "__generated__/HomeViewSectionDiscoverMarketingCollectionsQuery.graphql"
import { HomeViewSectionDiscoverMarketingCollections_section$key } from "__generated__/HomeViewSectionDiscoverMarketingCollections_section.graphql"
import { Chip } from "app/Components/Chip"
import { SectionTitle } from "app/Components/SectionTitle"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { FlatList, ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionDiscoverMarketingCollectionsProps {
  section: HomeViewSectionDiscoverMarketingCollections_section$key
  index: number
}

export const HomeViewSectionDiscoverMarketingCollections: React.FC<
  HomeViewSectionDiscoverMarketingCollectionsProps
> = ({ section: sectionProp }) => {
  const section = useFragment(fragment, sectionProp)
  const links = extractNodes(section.linksConnection)

  if (links.length === 0) return null

  const numColumns = isTablet() ? Math.ceil(links.length / 2) : Math.ceil(links.length / 3)

  return (
    <Flex>
      <Flex pl={2}>
        <SectionTitle title={section.component?.title} />
      </Flex>
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
      >
        <FlatList
          scrollEnabled={true}
          contentContainerStyle={{ alignSelf: "flex-start" }}
          ItemSeparatorComponent={() => <Spacer y={1} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={numColumns}
          data={links}
          keyExtractor={(item) => item.internalID}
          renderItem={({ item }) => (
            <Chip
              key={item.href}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => {
                if (item?.href) navigate(item.href)
              }}
            />
          )}
        />
      </ScrollView>
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionDiscoverMarketingCollections_section on HomeViewSectionDiscoverMarketingCollections {
    __typename
    internalID
    contextModule
    ownerType
    component {
      title
    }
    linksConnection(first: 10) {
      edges {
        node {
          internalID
          title
          subtitle
          href
        }
      }
    }
  }
`

const HomeViewSectionDiscoverMarketingCollectionsPlaceholder: React.FC<FlexProps> = () => {
  const data = times(9).map((index) => {
    index
  })
  const numColumns = isTablet() ? Math.ceil(data.length / 2) : Math.ceil(data.length / 3)
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
            data={data}
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

const homeViewSectionDiscoverMarketingCollectionsQuery = graphql`
  query HomeViewSectionDiscoverMarketingCollectionsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionDiscoverMarketingCollections_section
      }
    }
  }
`

export const HomeViewSectionDiscoverMarketingCollectionsQueryRenderer: React.FC<SectionSharedProps> =
  withSuspense(({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionDiscoverMarketingCollectionsQuery>(
      homeViewSectionDiscoverMarketingCollectionsQuery,
      {
        id: sectionID,
      }
    )

    if (!data.homeView.section) {
      return null
    }

    return (
      <HomeViewSectionDiscoverMarketingCollections
        section={data.homeView.section}
        index={index}
        {...flexProps}
      />
    )
  }, HomeViewSectionDiscoverMarketingCollectionsPlaceholder)
