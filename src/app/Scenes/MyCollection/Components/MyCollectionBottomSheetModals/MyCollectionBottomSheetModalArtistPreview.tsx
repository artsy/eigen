import {
  Checkbox,
  Flex,
  InfoCircleIcon,
  Join,
  Message,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { MyCollectionBottomSheetModalArtistPreviewQuery } from "__generated__/MyCollectionBottomSheetModalArtistPreviewQuery.graphql"
import { MyCollectionBottomSheetModalArtistPreview_artist$data } from "__generated__/MyCollectionBottomSheetModalArtistPreview_artist.graphql"
import { MyCollectionBottomSheetModalArtistPreview_me$data } from "__generated__/MyCollectionBottomSheetModalArtistPreview_me.graphql"
import { ArtistListItemContainer, ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { ArtistKindPills } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPreview/ArtistKindPills"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { QueryRenderer, createFragmentContainer } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionBottomSheetModalArtistPreviewProps {
  artist: MyCollectionBottomSheetModalArtistPreview_artist$data
  me: MyCollectionBottomSheetModalArtistPreview_me$data
}

export const MyCollectionBottomSheetModalArtistPreview: React.FC<
  MyCollectionBottomSheetModalArtistPreviewProps
> = ({ artist, me }) => {
  const artworksCountWithinMyCollection = me?.myCollectionConnection?.totalCount ?? 0
  const canBeRemoved = artworksCountWithinMyCollection === 0

  return (
    <BottomSheetView>
      <Flex px={2} pt={2}>
        <Join separator={<Spacer y={4} />}>
          <Join separator={<Spacer y={2} />}>
            <ArtistListItemContainer
              artist={artist}
              uploadsCount={artworksCountWithinMyCollection}
            />
            <ArtistKindPills artist={artist} />
          </Join>

          <ShareArtistCheckbox onCheckboxPress={() => {}} />

          <RemoveTheArtist canBeRemoved={canBeRemoved} />
        </Join>
      </Flex>
    </BottomSheetView>
  )
}

const RemoveTheArtist: React.FC<{ canBeRemoved: boolean }> = ({ canBeRemoved }) => (
  <Join separator={<Spacer y={1} />}>
    {canBeRemoved ? (
      <Text onPress={() => {}} color="red100" variant="xs" underline>
        Remove Artist
      </Text>
    ) : (
      <Message
        variant="default"
        title="To remove this artist, please remove their artworks from My Collection first."
        IconComponent={() => <InfoCircleIcon width={18} height={18} fill="black100" />}
      />
    )}
  </Join>
)

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
        ...ArtistKindPills_artist
      }
    `,
    me: graphql`
      fragment MyCollectionBottomSheetModalArtistPreview_me on Me {
        myCollectionConnection(artistIDs: [$artistID]) {
          totalCount
        }
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
          me {
            ...MyCollectionBottomSheetModalArtistPreview_me
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
          </Join>
        </Flex>
      </BottomSheetView>
    </>
  )
}
