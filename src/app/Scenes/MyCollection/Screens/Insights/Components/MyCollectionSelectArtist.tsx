import { ArtistItem_artist$key } from "__generated__/ArtistItem_artist.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import Spinner from "app/Components/Spinner"
import { isPad } from "app/utils/hardware"
import { Flex, Text } from "palette"
import { useScreenDimensions } from "shared/hooks"
import { ArtistItem } from "../ArtistItem"
import { AverageSalePriceArtistType } from "../AverageSalePriceSelectArtistModal"

interface SelectArtistListProps {
  artistsList: ArtistItem_artist$key[]
  isLoadingNext: boolean
  onItemPress: (artist: AverageSalePriceArtistType) => void
  onEndReached: () => void
}

export const SelectArtistList: React.FC<SelectArtistListProps> = (props) => {
  const { artistsList, onItemPress, onEndReached, isLoadingNext } = props
  const { width, safeAreaInsets } = useScreenDimensions()

  return (
    <AboveTheFoldFlatList<ArtistItem_artist$key>
      testID="select-artist-flatlist"
      initialNumToRender={isPad() ? 24 : 12}
      style={{ width, marginBottom: safeAreaInsets.bottom }}
      data={artistsList}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <Flex mb={2}>
          <Text variant="md">Artists You Collect</Text>
          <Text variant="xs" color="black60">
            With insights currently available
          </Text>
        </Flex>
      )}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      renderItem={({ item, index }) => (
        <ArtistItem isFirst={index === 0} artist={item} onPress={onItemPress} />
      )}
      ListFooterComponent={
        isLoadingNext ? (
          <Flex my={3} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        ) : null
      }
    />
  )
}
