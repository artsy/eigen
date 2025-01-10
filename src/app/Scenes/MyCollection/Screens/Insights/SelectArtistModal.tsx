import { Flex, Text } from "@artsy/palette-mobile"
import { ArtistItem_artist$key } from "__generated__/ArtistItem_artist.graphql"
import {
  MedianSalePriceAtAuctionQuery,
  MedianSalePriceAtAuctionQuery$data,
} from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import { SelectArtistModal_myCollectionInfo$key } from "__generated__/SelectArtistModal_myCollectionInfo.graphql"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { SearchInput } from "app/Components/SearchInput"
import { extractNodes } from "app/utils/extractNodes"
import { normalizeText } from "app/utils/normalizeText"
import React, { useEffect, useState } from "react"
import { Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { graphql, usePaginationFragment } from "react-relay"
import { SelectArtistList } from "./Components/MyCollectionSelectArtist"
import { artistsQueryVariables } from "./MedianSalePriceAtAuction"

interface SelectArtistModalProps {
  queryData: MedianSalePriceAtAuctionQuery$data
  visible: boolean
  closeModal?: () => void
  onItemPress: (artistID: string) => void
}

export const SelectArtistModal: React.FC<SelectArtistModalProps> = ({
  visible,
  closeModal,
  onItemPress,
  queryData,
}) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    MedianSalePriceAtAuctionQuery,
    SelectArtistModal_myCollectionInfo$key
  >(userInterestsConnectionFragment, queryData)

  const [query, setQuery] = useState<string>("")
  const [filteredArtists, setFilteredArtists] = useState<ArtistItem_artist$key[]>([])

  const artistsList = extractNodes(data?.me?.userInterestsConnection)
  const normalizedQuery = normalizeText(query)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(artistsQueryVariables.count)
  }

  useEffect(() => {
    if (normalizedQuery) {
      const filtered = artistsList.filter((artist) =>
        normalizeText(artist?.name).includes(normalizedQuery)
      )
      setFilteredArtists(filtered)
    }
  }, [query])

  return (
    <Modal
      testID="select-artist-modal"
      visible={visible}
      onDismiss={closeModal}
      animationType="slide"
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <NavigationHeader onLeftButtonPress={closeModal} hideBottomDivider>
          <Text variant="sm-display">Select Artist</Text>
        </NavigationHeader>

        <Flex flex={1} px={2}>
          <Flex pt={1} pb={2}>
            <SearchInput
              testID="select-artists-search-input"
              placeholder="Search Artist from Your Collection"
              value={query}
              onChangeText={setQuery}
              error={
                filteredArtists.length === 0 && normalizedQuery
                  ? "Please select from the list of artists in your collection with insights available."
                  : ""
              }
            />
          </Flex>

          <SelectArtistList
            artistsList={normalizedQuery ? filteredArtists : artistsList}
            ListHeaderComponent={!normalizedQuery ? ListHeaderComponent : undefined}
            onEndReached={handleLoadMore}
            isLoadingNext={isLoadingNext}
            onItemPress={onItemPress}
          />
        </Flex>
      </SafeAreaView>
    </Modal>
  )
}

const ListHeaderComponent = (
  <Flex mb={2}>
    <Text variant="sm-display">Artists You Collect</Text>
  </Flex>
)

const userInterestsConnectionFragment = graphql`
  fragment SelectArtistModal_myCollectionInfo on Query
  @refetchable(queryName: "SelectArtistModal_myCollectionInfoRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    me {
      userInterestsConnection(first: $count, after: $after)
        @connection(key: "SelectArtistModal_userInterestsConnection") {
        edges {
          node {
            ... on Artist {
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
