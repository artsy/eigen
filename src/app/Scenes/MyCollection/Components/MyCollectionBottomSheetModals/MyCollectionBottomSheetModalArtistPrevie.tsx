import { Checkbox, Flex, Join, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { MyCollectionBottomSheetModalArtistPreviewQuery } from "__generated__/MyCollectionBottomSheetModalArtistPreviewQuery.graphql"
import { MyCollectionBottomSheetModalArtistPreview_artist$data } from "__generated__/MyCollectionBottomSheetModalArtistPreview_artist.graphql"
import { ArtistListItemContainer, ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderBox } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { QueryRenderer, createFragmentContainer } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionBottomSheetModalArtistPreviewProps {
  artist: MyCollectionBottomSheetModalArtistPreview_artist$data
}
export const MyCollectionBottomSheetModalArtistPreview: React.FC<
  MyCollectionBottomSheetModalArtistPreviewProps
> = ({ artist }) => {
  return (
    <BottomSheetView>
      <Flex px={2} pt={2}>
        <Join separator={<Spacer y={4} />}>
          <ArtistListItemContainer artist={artist} />

          <ShareArtistCheckbox onCheckboxPress={() => {}} />

          <Text color="red100" underline onPress={() => {}}>
            Remove Artist
          </Text>
        </Join>
      </Flex>
    </BottomSheetView>
  )
}

const ShareArtistCheckbox: React.FC<{ onCheckboxPress: () => void }> = ({ onCheckboxPress }) => {
  return (
    <Touchable haptic onPress={onCheckboxPress}>
      <Flex flexDirection="row" alignItems="flex-start">
        <Checkbox>
          <>
            <Text variant="xs">Share this artist with galleries during inquiries.</Text>
            <Text variant="xs" color="black60">
              Galleries are more likely to respond if they can see the artists you collect.
            </Text>
          </>
        </Checkbox>
      </Flex>
    </Touchable>
  )
}
export const MyCollectionBottomSheetModalArtistPreviewFragmentContainer = createFragmentContainer(
  MyCollectionBottomSheetModalArtistPreview,
  {
    artist: graphql`
      fragment MyCollectionBottomSheetModalArtistPreview_artist on Artist {
        ...ArtistListItem_artist
      }
    `,
  }
)

export const MyCollectionBottomSheetModalArtistPreviewQueryRenderer: React.FC<{
  artistID: string
}> = ({ artistID }) => {
  return (
    <QueryRenderer<MyCollectionBottomSheetModalArtistPreviewQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query MyCollectionBottomSheetModalArtistPreviewQuery($artistID: String!) {
          artist(id: $artistID) {
            ...MyCollectionBottomSheetModalArtistPreview_artist
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        artistID,
      }}
      render={renderWithPlaceholder({
        Container: MyCollectionBottomSheetModalArtistPreviewFragmentContainer,
        renderPlaceholder: LoadingSkeleton,
        renderFallback: () => null,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <BottomSheetView>
        <Flex px={2} pt={2}>
          <Join separator={<Spacer y={4} />}>
            <ArtistListItemPlaceholder />
            <PlaceholderBox height={60} width={180} />
            <PlaceholderBox height={25} width={50} />
          </Join>
        </Flex>
      </BottomSheetView>
    </>
  )
}
