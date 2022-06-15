import { AverageSalePriceSelectArtistItem_artist$data } from "__generated__/AverageSalePriceSelectArtistItem_artist.graphql"
import Spinner from "app/Components/Spinner"
import { groupBy, sortBy } from "lodash"
import { Flex, Text } from "palette"
import { SectionList, SectionListData } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import { AverageSalePriceArtist } from "./AverageSalePriceSelectArtist"
import { ArtistSectionItem } from "./AverageSalePriceSelectArtistItem"

interface ArtistSectionListProps {
  artistsList: AverageSalePriceArtist[]
  isLoadingNext: boolean
  onEndReached: () => void
  onItemPress: (item: AverageSalePriceSelectArtistItem_artist$data) => void
}

export const ArtistSectionList: React.FC<ArtistSectionListProps> = ({
  artistsList,
  onEndReached,
  onItemPress,
  isLoadingNext,
}) => {
  const { width, safeAreaInsets } = useScreenDimensions()

  const groupedArtistsSections: ReadonlyArray<SectionListData<any, { [key: string]: any }>> =
    Object.entries(groupAndSortArtists(artistsList)).map(([lastNameInitial, artistData]) => ({
      sectionTitle: lastNameInitial,
      data: artistData,
    }))

  return (
    <SectionList
      testID="average-sale-price-select-artist-section-list"
      sections={groupedArtistsSections}
      stickySectionHeadersEnabled={false}
      onEndReached={onEndReached}
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
        item ? <ArtistSectionItem first={index === 0} artist={item} onPress={onItemPress} /> : <></>
      }
      ListFooterComponent={
        isLoadingNext ? (
          <Flex my={3} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        ) : null
      }
      style={{ width, marginBottom: safeAreaInsets.bottom }}
    />
  )
}

// Sorts the artists by last name initial and groups them
const groupAndSortArtists = (artistsList: AverageSalePriceArtist[]) => {
  const sorted = sortBy(artistsList, (artist) => artist?.initials?.slice(-1))

  return groupBy(sorted, (artist) => artist?.initials?.slice(-1))
}
