import { Show2_show } from "__generated__/Show2_show.graphql"
import { Show2Query } from "__generated__/Show2Query.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Flex, Separator, Spacer } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Show2ArtworksPaginationContainer as Show2Artworks } from "./Components/Show2Artworks"
import { Show2ContextCardFragmentContainer as ShowContextCard } from "./Components/Show2ContextCard"
import { Show2HeaderFragmentContainer as ShowHeader } from "./Components/Show2Header"
import { Show2InfoFragmentContainer as ShowInfo } from "./Components/Show2Info"
import { Show2InstallShotsFragmentContainer as ShowInstallShots } from "./Components/Show2InstallShots"

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

  const Artworks = () => {
    return (
      <Box px={2}>
        <Show2Artworks show={show} />
        <FilterModalNavigator
          isFilterArtworksModalVisible={isFilterArtworksModalVisible}
          id={show.internalID}
          slug={show.slug}
          mode={FilterModalMode.Show}
          exitModal={toggleFilterArtworksModal}
          closeModal={toggleFilterArtworksModal}
        />
      </Box>
    )
  }

  const sections = [
    <ShowHeader show={show} mx={2} />,
    ...(!!show.images?.length ? [<ShowInstallShots show={show} />] : []),
    <ShowInfo show={show} mx={2} />,
    ...(show.counts?.eligibleArtworks ? [<Artworks />] : []),
    <ShowContextCard show={show} />,
  ]

  return (
    <ArtworkFilterGlobalStateProvider>
      <>
        <FlatList<typeof sections[number]>
          data={sections}
          keyExtractor={(_, i) => String(i)}
          ListHeaderComponent={<Spacer mt={6} pt={2} />}
          ListFooterComponent={<Spacer my={2} />}
          ItemSeparatorComponent={() => <Spacer my={15} />}
          renderItem={({ item }) => item}
        />
        <AnimatedArtworkFilterButton isVisible onPress={toggleFilterArtworksModal} />
      </>
    </ArtworkFilterGlobalStateProvider>
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
      ...Show2ContextCard_show
      images {
        __typename
      }
      counts {
        eligibleArtworks
      }
      ...Show2Artworks_show
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
