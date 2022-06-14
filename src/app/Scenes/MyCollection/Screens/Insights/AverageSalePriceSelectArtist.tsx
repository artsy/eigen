import {
  AverageSalePriceSelectArtistModal_myCollectionInfo$data,
  AverageSalePriceSelectArtistModal_myCollectionInfo$key,
} from "__generated__/AverageSalePriceSelectArtistModal_myCollectionInfo.graphql"
import { AverageSalePriceSelectArtistQuery } from "__generated__/AverageSalePriceSelectArtistQuery.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { SearchInput } from "app/Components/SearchInput"
import Spinner from "app/Components/Spinner"
import { extractNodes } from "app/utils/extractNodes"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { groupBy, sortBy } from "lodash"
import { Flex, NoArtworkIcon, Text, Touchable, useColor } from "palette"
import React, { Suspense, useEffect, useState } from "react"
import { FlatList, SectionList, SectionListData } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

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

const groupAndSortArtists = (artistsList: any) => {
  const sorted = sortBy(artistsList, (artist) => artist.initials?.slice(-1))

  return groupBy(sorted, (artist) => artist.initials?.slice(-1))
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

  const {
    width,
    safeAreaInsets: { bottom },
  } = useScreenDimensions()

  const artistsList = extractNodes(data?.me?.myCollectionInfo?.collectedArtistsConnection)

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(artistsQueryVariables.count)
  }

  useEffect(() => {
    if (query.length > 0) {
      const filtered = artistsList.filter(
        (artist) => artist?.name?.toLowerCase().includes(query.toLowerCase()) || false
      )
      setFilteredArtists(filtered)
    }
  }, [query])

  const groupedArtistsSections: ReadonlyArray<SectionListData<any, { [key: string]: any }>> =
    Object.entries(groupAndSortArtists(artistsList)).map(([initial, artistData]) => {
      const sectionTitle = initial

      return { sectionTitle, data: artistData }
    })

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
          />
        </Flex>

        {query.length > 0 ? (
          <FlatList
            data={filteredArtists}
            keyExtractor={(item) => item.internalID}
            renderItem={({ item }) => (
              <ArtistSectionItem artist={item} onPress={() => onItemPress(item)} />
            )}
          />
        ) : (
          <SectionList
            sections={groupedArtistsSections}
            stickySectionHeadersEnabled={false}
            onEndReached={handleLoadMore}
            keyExtractor={(item) => item.internalID}
            ListHeaderComponent={() => (
              <>
                <Text variant="md">Artists You Collect</Text>
                <Text variant="xs" color="black60">
                  With insights currently available
                </Text>
              </>
            )}
            renderSectionHeader={({ section: { sectionTitle } }) => (
              <Flex bg="white">
                <Text py="2" variant="md">
                  {sectionTitle}
                </Text>
              </Flex>
            )}
            renderItem={({ item, index }) =>
              item ? (
                <ArtistSectionItem
                  first={index === 0}
                  artist={item}
                  onPress={() => onItemPress(item)}
                />
              ) : (
                <></>
              )
            }
            ListFooterComponent={
              isLoadingNext ? (
                <Flex my={3} flexDirection="row" justifyContent="center">
                  <Spinner />
                </Flex>
              ) : null
            }
            style={{ width, marginBottom: bottom }}
          />
        )}
      </Flex>
    </FancyModal>
  )
}

interface ArtistSectionItemProps {
  artist: AverageSalePriceArtist
  onPress: () => void
  first?: boolean
}

const ArtistSectionItem: React.FC<ArtistSectionItemProps> = ({ artist, first, onPress }) => {
  const color = useColor()

  return (
    <Touchable underlayColor={color("black5")} onPress={onPress} haptic>
      <Flex
        pt={first ? 0 : 1}
        pb={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {!artist.imageUrl ? (
          <Flex
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="black10"
            alignItems="center"
            justifyContent="center"
            style={{ marginTop: 3 }}
          >
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          </Flex>
        ) : (
          <Flex
            width={40}
            height={40}
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            // To align the image with the text we have to add top margin to compensate the line height.
            style={{ marginTop: 3 }}
          >
            <OpaqueImageView width={40} height={40} imageURL={artist.imageUrl} />
          </Flex>
        )}
        {/* Sale Artwork Artist Name, Birthday and Nationality */}
        <Flex flex={1} pl={1}>
          {!!artist.name && (
            <Text variant="md" ellipsizeMode="middle" numberOfLines={2}>
              {artist.name}
            </Text>
          )}
          {!!artist.formattedNationalityAndBirthday && (
            <Flex>
              <Text variant="xs" ellipsizeMode="middle" color="black60">
                {artist?.formattedNationalityAndBirthday}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}

export const AverageSalePriceSelectArtistModal: React.FC<
  AverageSalePriceSelectArtistModalProps
> = ({ visible, closeModal, onItemPress }) => {
  return (
    <Suspense fallback={<Text>Sup</Text>}>
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
              formattedNationalityAndBirthday
              imageUrl
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
