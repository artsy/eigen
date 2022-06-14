import { AverageSalePriceSelectArtistItem_artist$data } from "__generated__/AverageSalePriceSelectArtistItem_artist.graphql"
import {
  AverageSalePriceSelectArtistModal_myCollectionInfo$data,
  AverageSalePriceSelectArtistModal_myCollectionInfo$key,
} from "__generated__/AverageSalePriceSelectArtistModal_myCollectionInfo.graphql"
import { AverageSalePriceSelectArtistQuery } from "__generated__/AverageSalePriceSelectArtistQuery.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { SearchInput } from "app/Components/SearchInput"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Flex, Text } from "palette"
import React, { Suspense, useEffect, useState } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { ArtistSectionItem } from "./AverageSalePriceSelectArtistItem"
import { ArtistSectionList } from "./AverageSalePriceSelectArtistList"

const PAGE_SIZE = 20

export type AverageSalePriceArtist = ExtractNodeType<
  NonNullable<
    NonNullable<AverageSalePriceSelectArtistModal_myCollectionInfo$data["me"]>["myCollectionInfo"]
  >["collectedArtistsConnection"]
>

interface AverageSalePriceSelectArtistModalProps {
  visible: boolean
  closeModal?: () => void
  onItemPress: (artist: any) => void
}

export const AverageSalePriceSelectArtistList: React.FC<AverageSalePriceSelectArtistModalProps> = ({
  visible,
  closeModal,
  onItemPress,
}) => {
  const queryData = useLazyLoadQuery<AverageSalePriceSelectArtistQuery>(
    AverageSalePriceSelectArtistScreenQuery,
    artistsQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    AverageSalePriceSelectArtistQuery,
    AverageSalePriceSelectArtistModal_myCollectionInfo$key
  >(collectedArtistsConnectionFragment, queryData)

  const [query, setQuery] = useState<string>("")
  const [filteredArtists, setFilteredArtists] = useState<any>([])

  const artistsList = extractNodes(data?.me?.myCollectionInfo?.collectedArtistsConnection)

  const handleSelect = (artist: AverageSalePriceSelectArtistItem_artist$data) => {
    onItemPress(artist)
    setQuery("")
  }

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(artistsQueryVariables.count)
  }

  useEffect(() => {
    if (query.length > 0) {
      const filtered = artistsList.filter((artist) =>
        artist?.name?.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredArtists(filtered)
    }
  }, [query])

  return (
    <FancyModal
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
            enableCancelButton
            onCancelPress={() => setQuery("")}
            placeholder="Search Artist from Your Collection"
            value={query}
            onChangeText={setQuery}
            error={
              filteredArtists.length === 0 && query.length > 0
                ? "Please select from the list of artists in your collection with insights available."
                : ""
            }
          />
        </Flex>

        {query.length > 0 ? (
          <FlatList
            data={filteredArtists}
            keyExtractor={(item) => item.internalID}
            renderItem={({ item }) => <ArtistSectionItem artist={item} onPress={handleSelect} />}
          />
        ) : (
          <ArtistSectionList
            artistsList={artistsList}
            onEndReached={handleLoadMore}
            isLoadingNext={isLoadingNext}
            onItemPress={onItemPress}
          />
        )}
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
              id
              internalID
              name
              initials
              ...AverageSalePriceSelectArtistItem_artist
            }
          }
        }
      }
    }
  }
`

const AverageSalePriceSelectArtistScreenQuery = graphql`
  query AverageSalePriceSelectArtistQuery($count: Int, $after: String) {
    ...AverageSalePriceSelectArtistModal_myCollectionInfo @arguments(count: $count, after: $after)
  }
`

const artistsQueryVariables = {
  count: PAGE_SIZE,
}
