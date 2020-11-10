import { Show2_show } from "__generated__/Show2_show.graphql"
import { Show2Query } from "__generated__/Show2Query.graphql"
import { AnimatedArtworkFilterButton } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, Separator, Spacer } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Show2ArtworksWithNavigation as Show2Artworks } from "./Components/Show2Artworks"
import { Show2ArtworksEmptyStateFragmentContainer } from "./Components/Show2ArtworksEmptyState"
import { Show2ContextCardFragmentContainer as ShowContextCard } from "./Components/Show2ContextCard"
import { Show2HeaderFragmentContainer as ShowHeader } from "./Components/Show2Header"
import { Show2InfoFragmentContainer as ShowInfo } from "./Components/Show2Info"
import { Show2InstallShotsFragmentContainer as ShowInstallShots } from "./Components/Show2InstallShots"
import { Show2ViewingRoomFragmentContainer as ShowViewingRoom } from "./Components/Show2ViewingRoom"

interface Section {
  key: string
  element: JSX.Element
}

interface Show2QueryRendererProps {
  showID: string
}

interface Show2Props {
  show: Show2_show
}

export const Show2: React.FC<Show2Props> = ({ show }) => {
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const toggleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const artworkProps = { show, isFilterArtworksModalVisible, toggleFilterArtworksModal }

  const sections: Section[] = [
    { key: "header", element: <ShowHeader show={show} mx={2} /> },

    ...(Boolean(show.images?.length) ? [{ key: "install-shots", element: <ShowInstallShots show={show} /> }] : []),

    { key: "info", element: <ShowInfo show={show} mx={2} /> },

    ...(Boolean(show.viewingRoomIDs.length)
      ? [{ key: "viewing-room", element: <ShowViewingRoom show={show} mx={2} /> }]
      : []),

    {
      key: "separator-top",
      element: (
        <Box mx={2}>
          <Separator />
        </Box>
      ),
    },

    ...(Boolean(show.counts?.eligibleArtworks)
      ? [{ key: "artworks", element: <Show2Artworks {...artworkProps} /> }]
      : [{ key: "artworks-empty-state", element: <Show2ArtworksEmptyStateFragmentContainer show={show} mx={2} /> }]),

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
        context_screen: Schema.PageNames.Show2Page,
        context_screen_owner_type: Schema.OwnerEntityTypes.Show,
        context_screen_owner_id: show.internalID,
        context_screen_owner_slug: show.slug,
      }}
    >
      <ArtworkFilterGlobalStateProvider>
        <FlatList<Section>
          data={sections}
          keyExtractor={({ key }) => key}
          ListHeaderComponent={<Spacer mt={6} pt={2} />}
          ListFooterComponent={<Spacer my={2} />}
          ItemSeparatorComponent={() => <Spacer my={15} />}
          contentContainerStyle={{ paddingTop: useScreenDimensions().safeAreaInsets.top }}
          renderItem={({ item: { element } }) => element}
        />
        <AnimatedArtworkFilterButton isVisible onPress={toggleFilterArtworksModal} />
      </ArtworkFilterGlobalStateProvider>
    </ProvideScreenTracking>
  )
}

export const Show2FragmentContainer = createFragmentContainer(Show2, {
  show: graphql`
    fragment Show2_show on Show {
      internalID
      slug
      ...Show2Header_show
      ...Show2InstallShots_show
      ...Show2Info_show
      ...Show2ViewingRoom_show
      ...Show2ContextCard_show
      ...Show2Artworks_show
      ...Show2ArtworksEmptyState_show
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

export const Show2QueryRenderer: React.FC<Show2QueryRendererProps> = ({ showID }) => {
  return (
    <QueryRenderer<Show2Query>
      environment={defaultEnvironment}
      query={graphql`
        query Show2Query($showID: String!) {
          show(id: $showID) @principalField {
            ...Show2_show
          }
        }
      `}
      variables={{ showID }}
      render={renderWithPlaceholder({
        Container: Show2FragmentContainer,
        renderPlaceholder: () => <Show2Placeholder />,
      })}
    />
  )
}

export const Show2Placeholder: React.FC = () => (
  <Flex>
    <PlaceholderBox height={400} />
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
      <Flex>
        <Spacer mb={2} />
        {/* Show name */}
        <PlaceholderText width={220} />
        {/* Show info */}
        <PlaceholderText width={190} />
        <PlaceholderText width={190} />
      </Flex>
    </Flex>
    <Spacer mb={2} />
    <Separator />
    <Spacer mb={2} />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)
