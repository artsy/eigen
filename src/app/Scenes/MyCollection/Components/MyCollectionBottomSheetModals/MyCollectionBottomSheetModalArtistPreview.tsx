import {
  Checkbox,
  Flex,
  InfoCircleIcon,
  Join,
  Message,
  Spacer,
  Text,
  useSpace,
} from "@artsy/palette-mobile"
import { BOTTOM_TABS_HEIGHT } from "@artsy/palette-mobile/dist/elements/Screen/StickySubHeader"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { MyCollectionBottomSheetModalArtistPreviewQuery } from "__generated__/MyCollectionBottomSheetModalArtistPreviewQuery.graphql"
import { MyCollectionBottomSheetModalArtistPreview_artist$data } from "__generated__/MyCollectionBottomSheetModalArtistPreview_artist.graphql"
import { MyCollectionBottomSheetModalArtistPreview_me$data } from "__generated__/MyCollectionBottomSheetModalArtistPreview_me.graphql"
import { ArtistListItemContainer, ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { useToast } from "app/Components/Toast/toastHook"
import { ArtistKindPills } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPreview/ArtistKindPills"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { deleteUserInterest } from "app/Scenes/MyCollection/mutations/deleteUserInterest"
import { updateUserInterest } from "app/Scenes/MyCollection/mutations/updateUserInterest"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useAndroidActionSheetStyles } from "app/utils/hooks/useAndroidActionSheetStyles"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { QueryRenderer, createFragmentContainer, graphql } from "react-relay"
import useDebounce from "react-use/lib/useDebounce"

interface MyCollectionBottomSheetModalArtistPreviewProps {
  artist: MyCollectionBottomSheetModalArtistPreview_artist$data
  me: MyCollectionBottomSheetModalArtistPreview_me$data
  interestId: string
}

export const MyCollectionBottomSheetModalArtistPreview: React.FC<
  MyCollectionBottomSheetModalArtistPreviewProps
> = ({ artist, me, interestId }) => {
  const artworksCountWithinMyCollection = me?.myCollectionConnection?.totalCount ?? 0
  const canBeRemoved = artworksCountWithinMyCollection === 0
  const { showActionSheetWithOptions } = useActionSheet()
  const androidCustomSheetStyles = useAndroidActionSheetStyles()

  const [isPrivate, setIsPrivate] = useState(me.userInterest?.private ?? false)

  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)

  const toast = useToast()
  const { bottom } = useSafeAreaInsets()

  const space = useSpace()

  useDebounce(
    () => {
      if (me.userInterest?.private === isPrivate) {
        return
      }

      updateUserInterest({
        id: interestId,
        private: isPrivate,
      }).then(() => {
        refreshMyCollection()
      })
    },
    300,
    [isPrivate]
  )

  const deleteArtist = () => {
    deleteUserInterest({
      id: interestId,
    })
      .then(() => {
        toast.show("Artist removed from My Collection", "bottom", {
          backgroundColor: "green100",
        })
        // Hide modal after removing artist
        setViewKind({ viewKind: null })

        refreshMyCollection()
      })
      .catch((error) => {
        console.error(error)
        toast.show("Something went wrong", "bottom", {
          backgroundColor: "red100",
        })
      })
  }

  return (
    <BottomSheetView
      style={{
        paddingBottom: bottom + BOTTOM_TABS_HEIGHT + space(2),
      }}
    >
      <Flex px={2} pt={2}>
        <Join separator={<Spacer y={2} />}>
          <ArtistListItemContainer
            artist={artist}
            disableNavigation={!!artist?.isPersonalArtist}
            uploadsCount={artworksCountWithinMyCollection}
            isPrivate={me.userInterest?.private}
            showFollowButton={!artist?.isPersonalArtist}
          />
          <ArtistKindPills artist={artist} />

          <Flex flexDirection="row" alignItems="flex-start">
            <Checkbox
              checked={!isPrivate}
              accessibilityState={{ checked: isPrivate }}
              onPress={() => {
                setIsPrivate(!isPrivate)
              }}
            >
              <>
                <Text variant="xs">Share this artist with galleries during inquiries.</Text>
                <Text variant="xs" color="mono60">
                  Galleries are more likely to respond if they can see the artists you collect.
                </Text>
              </>
            </Checkbox>
          </Flex>

          {canBeRemoved ? (
            <Text
              onPress={() => {
                showActionSheetWithOptions(
                  {
                    title: "This artist will be removed from My Collection.",
                    options: ["Remove Artist", "Keep Artist"],
                    destructiveButtonIndex: 0,
                    cancelButtonIndex: 1,
                    useModal: true,
                    ...androidCustomSheetStyles,
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 0) {
                      deleteArtist()
                    }
                  }
                )
              }}
              color="red100"
              variant="xs"
              underline
            >
              Remove Artist
            </Text>
          ) : (
            <>
              <Spacer y={1} />
              <Message
                variant="default"
                title="To remove this artist, please remove their artworks from My Collection first."
                IconComponent={() => <InfoCircleIcon width={18} height={18} fill="mono100" />}
              />
            </>
          )}
        </Join>
      </Flex>
    </BottomSheetView>
  )
}

export const MyCollectionBottomSheetModalArtistPreviewFragmentContainer = createFragmentContainer(
  MyCollectionBottomSheetModalArtistPreview,
  {
    artist: graphql`
      fragment MyCollectionBottomSheetModalArtistPreview_artist on Artist {
        ...ArtistListItem_artist
        ...ArtistKindPills_artist
        isPersonalArtist
      }
    `,
    me: graphql`
      fragment MyCollectionBottomSheetModalArtistPreview_me on Me {
        myCollectionConnection(artistIDs: [$artistID]) {
          totalCount
        }
        userInterest(id: $interestId) {
          id
          private
        }
      }
    `,
  }
)

export const MyCollectionBottomSheetModalArtistPreviewQueryRenderer: React.FC<{
  artistID: string
  interestId: string
}> = ({ artistID, interestId }) => {
  return (
    <QueryRenderer<MyCollectionBottomSheetModalArtistPreviewQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query MyCollectionBottomSheetModalArtistPreviewQuery(
          $artistID: String!
          $interestId: String!
        ) {
          artist(id: $artistID) {
            ...MyCollectionBottomSheetModalArtistPreview_artist
          }
          me {
            ...MyCollectionBottomSheetModalArtistPreview_me
          }
        }
      `}
      variables={{
        artistID,
        interestId,
      }}
      render={renderWithPlaceholder({
        Container: MyCollectionBottomSheetModalArtistPreviewFragmentContainer,
        renderPlaceholder: LoadingSkeleton,
        renderFallback: () => null,
        initialProps: {
          interestId,
        },
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
