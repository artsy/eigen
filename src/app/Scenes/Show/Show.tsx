import { Box, Flex, Separator, Spacer } from "@artsy/palette-mobile"
import { ShowQuery } from "__generated__/ShowQuery.graphql"
import { Show_show$data } from "__generated__/Show_show.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { HeaderArtworksFilterWithTotalArtworks as HeaderArtworksFilter } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { times } from "lodash"
import React, { Suspense, useRef, useState } from "react"
import { Animated } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ShowArtworksWithNavigation as ShowArtworks } from "./Components/ShowArtworks"
import { ShowContextCardFragmentContainer as ShowContextCard } from "./Components/ShowContextCard"
import { ShowHeaderFragmentContainer as ShowHeader } from "./Components/ShowHeader"
import { ShowInfoFragmentContainer as ShowInfo } from "./Components/ShowInfo"
import { ShowInstallShotsFragmentContainer as ShowInstallShots } from "./Components/ShowInstallShots"
import { ShowViewingRoomFragmentContainer as ShowViewingRoom } from "./Components/ShowViewingRoom"

interface Section {
  key: string
  element: React.JSX.Element
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

  const openeFilterArtworksModal = () => {
    setVisible(true)
  }

  const closeFilterArtworksModal = () => {
    setVisible(false)
  }

  const artworkProps = { show, visible, closeFilterArtworksModal }

  const sections: Section[] = [
    { key: "header", element: <ShowHeader show={show} mx={2} mt={2} /> },

    ...(Boolean(show.images?.length)
      ? [{ key: "install-shots", element: <ShowInstallShots show={show} /> }]
      : []),

    { key: "info", element: <ShowInfo show={show} mx={2} /> },

    {
      key: "filter",
      element: (
        <Flex backgroundColor="mono0">
          <Separator />
          <HeaderArtworksFilter onPress={openeFilterArtworksModal} />
        </Flex>
      ),
    },

    ...(Boolean(show.viewingRoomIDs.length)
      ? [{ key: "viewing-room", element: <ShowViewingRoom show={show} mx={2} /> }]
      : []),

    {
      key: "artworks",
      element: (
        <Suspense fallback={<PlaceholderGrid />}>
          <ShowArtworks {...artworkProps} />
        </Suspense>
      ),
    },

    {
      key: "separator-bottom",
      element: (
        <Box>
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
          stickyHeaderIndices={[sections.findIndex((section) => section.key === "filter")]}
          viewabilityConfig={viewConfigRef.current}
          ListFooterComponent={() => <Spacer y={2} />}
          ItemSeparatorComponent={() => <Spacer y="15px" />}
          contentContainerStyle={{
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
    }
  `,
})

export const ShowScreenQuery = graphql`
  query ShowQuery($showID: String!) @cacheable {
    show(id: $showID) @principalField {
      ...Show_show
    }
  }
`

export const ShowQueryRenderer: React.FC<ShowQueryRendererProps> = ({ showID }) => {
  return (
    <QueryRenderer<ShowQuery>
      environment={getRelayEnvironment()}
      query={ShowScreenQuery}
      variables={{ showID }}
      cacheConfig={{
        force: false,
      }}
      render={renderWithPlaceholder({
        Container: ShowFragmentContainer,
        renderPlaceholder: () => <ShowPlaceholder />,
      })}
    />
  )
}

export const ShowPlaceholder: React.FC = () => {
  return (
    <Flex px={2} pt={2}>
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
