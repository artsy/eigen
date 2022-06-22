import {
  ArtistItem_artist$data,
  ArtistItem_artist$key,
} from "__generated__/ArtistItem_artist.graphql"
import { AverageSalePriceSelectArtistModal_myCollectionInfo$key } from "__generated__/AverageSalePriceSelectArtistModal_myCollectionInfo.graphql"
import { AverageSalePriceSelectArtistModalQuery } from "__generated__/AverageSalePriceSelectArtistModalQuery.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { SearchInput } from "app/Components/SearchInput"
import { extractNodes } from "app/utils/extractNodes"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { trim } from "lodash"
import { Flex, Text } from "palette"
import React, { Suspense, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { SelectArtistList } from "./Components/MyCollectionSelectArtist"

const PAGE_SIZE = 50

export type AverageSalePriceArtistType = CleanRelayFragment<ArtistItem_artist$data>

interface AverageSalePriceSelectArtistModalProps {
  visible: boolean
  closeModal?: () => void
  onItemPress: (artist: AverageSalePriceArtistType) => void
}

const AverageSalePriceSelectArtistList: React.FC<AverageSalePriceSelectArtistModalProps> = ({
  visible,
  closeModal,
  onItemPress,
}) => {
  const queryData = useLazyLoadQuery<AverageSalePriceSelectArtistModalQuery>(
    AverageSalePriceSelectArtistScreenQuery,
    artistsQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    AverageSalePriceSelectArtistModalQuery,
    AverageSalePriceSelectArtistModal_myCollectionInfo$key
  >(collectedArtistsConnectionFragment, queryData)

  const [query, setQuery] = useState<string>("")
  const [filteredArtists, setFilteredArtists] = useState<ArtistItem_artist$key[]>([])

  const artistsList = extractNodes(data?.me?.myCollectionInfo?.collectedArtistsConnection)
  const trimmedQuery = trim(query)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(artistsQueryVariables.count)
  }

  useEffect(() => {
    if (trimmedQuery) {
      const filtered = artistsList.filter((artist) =>
        artist?.name?.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
      setFilteredArtists(filtered)
    }
  }, [query])

  return (
    <FancyModal
      testID="average-sale-price-select-artist-modal"
      visible={visible}
      onBackgroundPressed={closeModal}
      fullScreen
      animationPosition="right"
    >
      <FancyModalHeader onLeftButtonPress={closeModal} hideBottomDivider>
        <Text variant="md">Select Artist</Text>
      </FancyModalHeader>

      <Flex flex={1} px={2}>
        <Flex pt={1} pb={2}>
          <SearchInput
            testID="select-artists-search-input"
            enableCancelButton
            onCancelPress={() => setQuery("")}
            placeholder="Search Artist from Your Collection"
            value={query}
            onChangeText={setQuery}
            error={
              filteredArtists.length === 0 && trimmedQuery
                ? "Please select from the list of artists in your collection with insights available."
                : ""
            }
          />
        </Flex>

        <SelectArtistList
          artistsList={trimmedQuery ? filteredArtists : artistsList}
          onEndReached={handleLoadMore}
          isLoadingNext={isLoadingNext}
          onItemPress={onItemPress}
        />
      </Flex>
    </FancyModal>
  )
}

export const AverageSalePriceSelectArtistModal: React.FC<
  AverageSalePriceSelectArtistModalProps
> = ({ visible, closeModal, onItemPress }) => {
  return (
    <Suspense fallback={null}>
      <AverageSalePriceSelectArtistList
        visible={visible}
        onItemPress={onItemPress}
        closeModal={closeModal}
      />
    </Suspense>
  )
}

const collectedArtistsConnectionFragment = graphql`
  fragment AverageSalePriceSelectArtistModal_myCollectionInfo on Query
  @refetchable(queryName: "AverageSalePriceSelectArtistModal_myCollectionInfoRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    me {
      myCollectionInfo {
        collectedArtistsConnection(first: $count, after: $after)
          @connection(key: "AverageSalePriceSelectArtistModal_collectedArtistsConnection") {
          edges {
            node {
              internalID
              name
              ...ArtistItem_artist
            }
          }
        }
      }
    }
  }
`

export const AverageSalePriceSelectArtistScreenQuery = graphql`
  query AverageSalePriceSelectArtistModalQuery($count: Int, $after: String) {
    ...AverageSalePriceSelectArtistModal_myCollectionInfo @arguments(count: $count, after: $after)
  }
`

const artistsQueryVariables = {
  count: PAGE_SIZE,
}
