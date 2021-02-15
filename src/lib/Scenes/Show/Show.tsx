import { Show_show } from "__generated__/Show_show.graphql"
import { ShowQuery } from "__generated__/ShowQuery.graphql"
import { AnimatedArtworkFilterButton } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { times } from "lodash"
import { Box, Flex, Separator, Spacer } from "palette"
import React, { useRef, useState } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ShowArtworksWithNavigation as ShowArtworks } from "./Components/ShowArtworks"
import { ShowArtworksEmptyStateFragmentContainer } from "./Components/ShowArtworksEmptyState"
import { ShowContextCardFragmentContainer as ShowContextCard } from "./Components/ShowContextCard"
import { ShowHeaderFragmentContainer as ShowHeader } from "./Components/ShowHeader"
import { ShowInfoFragmentContainer as ShowInfo } from "./Components/ShowInfo"
import { ShowInstallShotsFragmentContainer as ShowInstallShots } from "./Components/ShowInstallShots"
import { ShowViewingRoomFragmentContainer as ShowViewingRoom } from "./Components/ShowViewingRoom"

interface Section {
  key: string
  element: JSX.Element
}

interface ShowQueryRendererProps {
  showID: string
}

interface ShowProps {
  show: Show_show
}

export interface ViewableItems {
  viewableItems?: ViewToken[]
}

interface ViewToken {
  item?: Section
  key?: string
  index?: number | null
  isViewable?: boolean
  section?: any
}

export const Show: React.FC<ShowProps> = ({ show }) => {
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const [isFilterButtonVisible, setisFilterButtonVisible] = useState(false)

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 })
  const viewableItemsChangedRef = useRef(({ viewableItems }: ViewableItems) => {
    const artworksItem = (viewableItems! ?? []).find((viewableItem: ViewToken) => {
      return viewableItem?.item?.key === "artworks"
    })
    setisFilterButtonVisible(artworksItem?.isViewable ?? false)
  })

  const toggleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const artworkProps = { show, isFilterArtworksModalVisible, toggleFilterArtworksModal }

  const sections: Section[] = [
    { key: "header", element: <ShowHeader show={show} mx="2" /> },

    ...(Boolean(show.images?.length) ? [{ key: "install-shots", element: <ShowInstallShots show={show} /> }] : []),

    { key: "info", element: <ShowInfo show={show} mx="2" /> },

    ...(Boolean(show.viewingRoomIDs.length)
      ? [{ key: "viewing-room", element: <ShowViewingRoom show={show} mx="2" /> }]
      : []),

    {
      key: "separator-top",
      element: (
        <Box mx="2">
          <Separator />
        </Box>
      ),
    },

    {
      key: "artworks",
      element: Boolean(show.counts?.eligibleArtworks) ? (
        <ShowArtworks {...artworkProps} />
      ) : (
        <ShowArtworksEmptyStateFragmentContainer show={show} mx="2" />
      ),
    },

    {
      key: "separator-bottom",
      element: (
        <Box mx="2">
          <Separator />
        </Box>
      ),
    },

    { key: "context", element: <ShowContextCard show={show} mx="2" /> },
  ]

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ShowPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Show,
        context_screen_owner_id: show.internalID,
        context_screen_owner_slug: show.slug,
      }}
    >
      <ArtworkFilterGlobalStateProvider>
        <FlatList<Section>
          data={sections}
          keyExtractor={({ key }) => key}
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={viewableItemsChangedRef.current}
          ListHeaderComponent={<Spacer mt="6" pt="2" />}
          ListFooterComponent={<Spacer my="2" />}
          ItemSeparatorComponent={() => <Spacer my={15} />}
          contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top, paddingBottom: 40 }}
          renderItem={({ item: { element } }) => element}
        />
        <AnimatedArtworkFilterButton
          isVisible={isFilterButtonVisible && Boolean(show.counts?.eligibleArtworks)}
          onPress={toggleFilterArtworksModal}
        />
      </ArtworkFilterGlobalStateProvider>
    </ProvideScreenTracking>
  )
}

export const ShowFragmentContainer = createFragmentContainer(Show, {
  show: graphql`
    fragment Show_show on Show {
      internalID
      slug
      ...ShowHeader_show
      ...ShowInstallShots_show
      ...ShowInfo_show
      ...ShowViewingRoom_show
      ...ShowContextCard_show
      ...ShowArtworks_show
      ...ShowArtworksEmptyState_show
      viewingRoomIDs
      images(default: false) {
        __typename
      }
      counts {
        eligibleArtworks
      }
    }
  `,
})

export const ShowQueryRenderer: React.FC<ShowQueryRendererProps> = ({ showID }) => {
  return (
    <QueryRenderer<ShowQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ShowQuery($showID: String!) {
          show(id: $showID) @principalField {
            ...Show_show
          }
        }
      `}
      variables={{ showID }}
      render={renderWithPlaceholder({
        Container: ShowFragmentContainer,
        renderPlaceholder: () => <ShowPlaceholder />,
      })}
    />
  )
}

export const ShowPlaceholder: React.FC = () => (
  <Flex px="2" pt={useScreenDimensions().safeAreaInsets.top + 80}>
    {/* Title */}
    <PlaceholderText height={25} width={200 + Math.random() * 100} />
    <PlaceholderText height={25} width={100 + Math.random() * 100} />
    <Spacer mb={15} />
    <PlaceholderText width={220} />
    <Spacer mb={20} />
    {/* Owner */}
    <PlaceholderText width={70} />
    <Spacer mb={15} />
    {/* Images */}
    <Flex flexDirection="row" py="2">
      {times(3).map((index: number) => (
        <Flex key={index} marginRight="1">
          <PlaceholderBox height={300} width={250} />
        </Flex>
      ))}
    </Flex>
    <Spacer mb={15} />
    <PlaceholderText width="100%" />
    <PlaceholderText width="100%" />
    <PlaceholderText width="100%" />
    <PlaceholderText width="100%" />
    <PlaceholderText width="100%" />
    <Spacer mb={15} />

    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)
