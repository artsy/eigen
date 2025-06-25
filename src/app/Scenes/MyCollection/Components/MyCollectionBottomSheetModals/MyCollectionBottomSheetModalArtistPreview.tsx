import { InfoIcon } from "@artsy/icons/native"
import { Checkbox, Flex, Join, Message, Spacer, Text } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { MyCollectionBottomSheetModalArtistPreviewQuery } from "__generated__/MyCollectionBottomSheetModalArtistPreviewQuery.graphql"
import { MyCollectionBottomSheetModalArtistPreview_artist$key } from "__generated__/MyCollectionBottomSheetModalArtistPreview_artist.graphql"
import { MyCollectionBottomSheetModalArtistPreview_me$key } from "__generated__/MyCollectionBottomSheetModalArtistPreview_me.graphql"
import { ArtistListItemContainer, ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { useToast } from "app/Components/Toast/toastHook"
import { ArtistKindPills } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPreview/ArtistKindPills"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { deleteUserInterest } from "app/Scenes/MyCollection/mutations/deleteUserInterest"
import { updateUserInterest } from "app/Scenes/MyCollection/mutations/updateUserInterest"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { refreshMyCollection } from "app/utils/refreshHelpers"
import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import useDebounce from "react-use/lib/useDebounce"

interface MyCollectionBottomSheetModalArtistPreviewProps {
  artist: MyCollectionBottomSheetModalArtistPreview_artist$key
  me: MyCollectionBottomSheetModalArtistPreview_me$key
  interestId: string
}

export const MyCollectionBottomSheetModalArtistPreview: React.FC<
  MyCollectionBottomSheetModalArtistPreviewProps
> = ({ artist, me, interestId }) => {
  const artistData = useFragment(artistFragment, artist)
  const meData = useFragment(meFragment, me)

  const artworksCountWithinMyCollection = meData?.myCollectionConnection?.totalCount ?? 0
  const canBeRemoved = artworksCountWithinMyCollection === 0

  const { showActionSheetWithOptions } = useActionSheet()

  const [isPrivate, setIsPrivate] = useState(meData?.userInterest?.private ?? false)

  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)

  const toast = useToast()

  useDebounce(
    () => {
      if (meData?.userInterest?.private === isPrivate) {
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

  const dismissBottomView = () => {
    setViewKind({ viewKind: null })
  }

  const safeAreaInset = useSafeAreaInsets()

  if (!artistData || !meData?.userInterest) {
    console.log("LOGD hmmmm artist = ", artistData, "me = ", meData)

    return <LoadingSkeleton />
  }

  const deleteArtist = () => {
    deleteUserInterest({
      id: interestId,
    })
      .then(() => {
        toast.show("Artist removed from My Collection", "bottom", {
          backgroundColor: "green100",
        })
        // Hide modal after removing artist
        dismissBottomView()

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
    <AutoHeightBottomSheet
      visible
      onDismiss={dismissBottomView}
      closeOnBackdropClick
      enableDismissOnClose
    >
      <Flex px={2} pt={2} mb={`${safeAreaInset.bottom}px`}>
        <Join separator={<Spacer y={2} />}>
          <ArtistListItemContainer
            artist={artistData}
            disableNavigation={!!artistData?.isPersonalArtist}
            uploadsCount={artworksCountWithinMyCollection}
            isPrivate={meData.userInterest?.private}
            showFollowButton={!artistData?.isPersonalArtist}
          />
          <ArtistKindPills artist={artistData} />

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
                IconComponent={() => <InfoIcon width={18} height={18} fill="mono100" />}
              />
            </>
          )}
        </Join>
      </Flex>
    </AutoHeightBottomSheet>
  )
}

export const MyCollectionBottomSheetModalArtistPreviewQueryRenderer = withSuspense<{
  artistID: string
  interestId: string
}>({
  Component: ({ artistID, interestId }) => {
    const data = useLazyLoadQuery<MyCollectionBottomSheetModalArtistPreviewQuery>(query, {
      artistID,
      interestId,
    })

    if (!data?.artist || !data?.me) {
      return <LoadingSkeleton />
    }

    return (
      <MyCollectionBottomSheetModalArtistPreview
        artist={data.artist}
        me={data.me}
        interestId={interestId}
      />
    )
  },
  LoadingFallback: () => <LoadingSkeleton />,
  ErrorFallback: () => null,
})

const query = graphql`
  query MyCollectionBottomSheetModalArtistPreviewQuery($artistID: String!, $interestId: String!) {
    artist(id: $artistID) {
      ...MyCollectionBottomSheetModalArtistPreview_artist
    }
    me {
      ...MyCollectionBottomSheetModalArtistPreview_me
    }
  }
`

const artistFragment = graphql`
  fragment MyCollectionBottomSheetModalArtistPreview_artist on Artist {
    ...ArtistListItem_artist
    ...ArtistKindPills_artist
    isPersonalArtist
  }
`

const meFragment = graphql`
  fragment MyCollectionBottomSheetModalArtistPreview_me on Me {
    myCollectionConnection(artistIDs: [$artistID]) {
      totalCount
    }
    userInterest(id: $interestId) {
      id
      private
    }
  }
`

const LoadingSkeleton: React.FC = () => {
  const safeAreaInset = useSafeAreaInsets()

  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)

  const dismissBottomView = () => {
    setViewKind({ viewKind: null })
  }

  return (
    <AutoHeightBottomSheet visible closeOnBackdropClick onDismiss={dismissBottomView}>
      <Flex px={2} pt={2} mb={`${safeAreaInset.bottom}px`}>
        <Join separator={<Spacer y={4} />}>
          <ArtistListItemPlaceholder />
        </Join>
      </Flex>
    </AutoHeightBottomSheet>
  )
}
