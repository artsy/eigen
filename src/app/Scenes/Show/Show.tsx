import { Spacer, Flex, Box, Separator } from "@artsy/palette-mobile"
import { ShowQuery } from "__generated__/ShowQuery.graphql"
import { Show_show$data } from "__generated__/Show_show.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { HeaderArtworksFilterWithTotalArtworks as HeaderArtworksFilter } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { times } from "lodash"
import React, { useRef, useState } from "react"
import { Animated } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
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
  show: Show_show$data
}

export const Show: React.FC<ShowProps> = ({ show }) => {
  const [visible, setVisible] = useState(false)
  const filterComponentAnimationValue = new Animated.Value(0)

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 30 })

  const toggleFilterArtworksModal = () => {
    setVisible(!visible)
  }

  const artworkProps = { show, visible, toggleFilterArtworksModal }

  const sections: Section[] = [
    { key: "header", element: <ShowHeader show={show} mx={2} /> },

    ...(Boolean(show.images?.length)
      ? [{ key: "install-shots", element: <ShowInstallShots show={show} /> }]
      : []),

    { key: "info", element: <ShowInfo show={show} mx={2} /> },

    {
      key: "filter",
      element: (
        <Flex backgroundColor="white">
          <Spacer y={1} />
          <HeaderArtworksFilter
            animationValue={filterComponentAnimationValue}
            onPress={toggleFilterArtworksModal}
          />
        </Flex>
      ),
    },

    ...(Boolean(show.viewingRoomIDs.length)
      ? [{ key: "viewing-room", element: <ShowViewingRoom show={show} mx={2} /> }]
      : []),

    {
      key: "artworks",
      element: Boolean(show.counts?.eligibleArtworks) ? (
        <ShowArtworks {...artworkProps} />
      ) : (
        <ShowArtworksEmptyStateFragmentContainer show={show} mx={2} />
      ),
    },

    {
      key: "separator-bottom",
      element: (
        <Box mx={2}>
          <Separator />
        </Box>
      ),
    },

    { key: "context", element: <ShowContextCard show={show} mx={2} /> },
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
      <ArtworkFiltersStoreProvider>
        <Animated.FlatList<Section>
          data={sections}
          keyExtractor={({ key }) => key}
          stickyHeaderIndices={[sections.findIndex((section) => section.key === "filter") + 1]}
          viewabilityConfig={viewConfigRef.current}
          ListHeaderComponent={<Spacer y={6} />}
          ListFooterComponent={<Spacer y={2} />}
          ItemSeparatorComponent={() => <Spacer y="15px" />}
          contentContainerStyle={{
            paddingTop: useScreenDimensions().safeAreaInsets.top,
            paddingBottom: 40,
          }}
          renderItem={({ item: { element } }) => element}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: filterComponentAnimationValue } } }],
            {
              useNativeDriver: true,
            }
          )}
          keyboardShouldPersistTaps="handled"
        />
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
}

export const ShowFragmentContainer = createFragmentContainer(Show, {
  show: graphql`
    fragment Show_show on Show {
      internalID
      slug
      isActive
      ...ShowHeader_show
      ...ShowInstallShots_show
      ...ShowInfo_show
      ...ShowViewingRoom_show
      ...ShowContextCard_show
      ...ShowArtworks_show @arguments(input: { sort: "partner_show_position" })
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
      environment={getRelayEnvironment()}
      query={graphql`
        query ShowQuery($showID: String!) @cacheable {
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

export const ShowPlaceholder: React.FC = () => {
  const saInsets = useSafeAreaInsets()
  return (
    <Flex px={2} pt={`${saInsets.top + 80}px`}>
      {/* Title */}
      <PlaceholderText height={25} width={200 + Math.random() * 100} />
      <PlaceholderText height={25} width={100 + Math.random() * 100} />
      <Spacer y="15px" />
      <PlaceholderText width={220} />
      <Spacer y={2} />
      {/* Owner */}
      <PlaceholderText width={70} />
      <Spacer y="15px" />
      {/* Images */}
      <Flex flexDirection="row" py={2}>
        {times(3).map((index: number) => (
          <Flex key={index} marginRight={1}>
            <PlaceholderBox height={300} width={250} />
          </Flex>
        ))}
      </Flex>
      <Spacer y="15px" />
      <PlaceholderText width="100%" />
      <PlaceholderText width="100%" />
      <PlaceholderText width="100%" />
      <PlaceholderText width="100%" />
      <PlaceholderText width="100%" />
      <Spacer y="15px" />

      {/* masonry grid */}
      <PlaceholderGrid />
    </Flex>
  )
}
