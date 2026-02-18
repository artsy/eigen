import { Flex } from "@artsy/palette-mobile"
import { ArtistItem_artist$key } from "__generated__/ArtistItem_artist.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import Spinner from "app/Components/Spinner"
import { ArtistItem } from "app/Scenes/MyCollection/Screens/Insights/ArtistItem"
import { useScreenDimensions } from "app/utils/hooks"
import { isTablet } from "react-native-device-info"

interface SelectArtistListProps {
  artistsList: ArtistItem_artist$key[]
  isLoadingNext: boolean
  ListHeaderComponent?: React.JSX.Element
  onItemPress: (artistID: string) => void
  onEndReached: () => void
}

export const SelectArtistList: React.FC<SelectArtistListProps> = (props) => {
  const { artistsList, onItemPress, onEndReached, isLoadingNext, ListHeaderComponent } = props
  const { width, safeAreaInsets } = useScreenDimensions()

  return (
    <AboveTheFoldFlatList<ArtistItem_artist$key>
      testID="select-artist-flatlist"
      initialNumToRender={isTablet() ? 24 : 12}
      style={{ width, marginBottom: safeAreaInsets.bottom }}
      data={artistsList}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      renderItem={({ item, index }) => (
        <ArtistItem isFirst={index === 0} artist={item} onPress={onItemPress} />
      )}
      ListFooterComponent={() =>
        isLoadingNext ? (
          <Flex my={4} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        ) : null
      }
    />
  )
}
