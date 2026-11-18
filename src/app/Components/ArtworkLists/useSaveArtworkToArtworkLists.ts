import { useSaveArtworkToArtworkLists_artwork$key } from "__generated__/useSaveArtworkToArtworkLists_artwork.graphql"
import { useArtworkListContext } from "app/Components/ArtworkLists/ArtworkListContext"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ArtworkEntity } from "app/Components/ArtworkLists/types"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { useUpdateArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { useLastSavedList } from "app/store/LastSavedListModel"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { SaveArtworkOptions, useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { refreshOnArtworkSave } from "app/utils/refreshHelpers"
import { graphql, useFragment } from "react-relay"

/** Slug used to reference the default "Saved Artworks" collection. */
export const SAVED_ARTWORKS_COLLECTION_ID = "saved-artwork"

interface Options extends Pick<SaveArtworkOptions, "onCompleted" | "onError"> {
  artworkFragmentRef: useSaveArtworkToArtworkLists_artwork$key
  saveToDefaultCollectionOnly?: boolean
  suppressToasts?: boolean
}

export const useSaveArtworkToArtworkLists = (options: Options) => {
  const toast = useArtworkListToast(null)
  const { artworkFragmentRef, onCompleted, suppressToasts, ...restOptions } = options
  const { artworkListID, removedArtworkIDs } = useArtworkListContext()
  const openSelectArtworkListsView = ArtworkListsStore.useStoreActions(
    (actions) => actions.openSelectArtworkListsView
  )

  const isLastSavedListEnabled = useFeatureFlag("ARDefaultToLastSavedList")
  const lastSavedList = useLastSavedList()
  const setLastSavedList = GlobalStore.actions.lastSavedList.setLastSavedList

  const artwork = useFragment(ArtworkFragment, artworkFragmentRef)
  const [commitListUpdate] = useUpdateArtworkListsForArtwork(artwork?.id ?? "")

  const customArtworkListsCount = artwork?.customArtworkLists?.totalCount ?? 0
  const isSavedToCustomArtworkLists = customArtworkListsCount > 0
  const artworkEntity: ArtworkEntity = {
    id: artwork?.id,
    internalID: artwork?.internalID,
    title: artwork?.title || "",
    year: artwork?.date,
    artistNames: artwork?.artistNames,
    imageURL: artwork?.preview?.url ?? null,
    isInAuction: !!artwork?.isInAuction,
  }
  let isSaved = artwork?.isSaved

  if (!options.saveToDefaultCollectionOnly) {
    if (artworkListID !== null) {
      const isArtworkRemovedFromArtworkList = removedArtworkIDs.find(
        (artworkID) => artworkID === artwork?.internalID
      )

      isSaved = !isArtworkRemovedFromArtworkList
    } else {
      isSaved = artwork?.isSaved || isSavedToCustomArtworkLists
    }
  }

  const saveArtworkToDefaultArtworkList = useSaveArtwork({
    ...restOptions,
    id: artwork.id,
    internalID: artwork.internalID,
    isSaved: !!artwork.isSaved,
    onCompleted: (isArtworkSaved) => {
      if (isLastSavedListEnabled && isArtworkSaved) {
        setLastSavedList({ internalID: SAVED_ARTWORKS_COLLECTION_ID, name: "Saved Artworks" })
      }

      onCompleted?.(isArtworkSaved)
    },
    optimisticUpdater: (isArtworkSaved, _store, isCalledBefore) => {
      if (isCalledBefore) {
        return
      }

      if (options.saveToDefaultCollectionOnly) {
        return
      }

      if (suppressToasts) {
        return
      }

      if (isArtworkSaved) {
        toast.savedToDefaultArtworkList({
          onToastPress: () => openSelectArtworkListsView(artworkEntity),
          isInAuction: !!artworkEntity.isInAuction,
        })

        return
      }

      toast.removedFromDefaultArtworkList()
    },
  })

  const openSelectArtworkListsForArtworkView = () => {
    openSelectArtworkListsView(artworkEntity)
  }

  const saveArtworkToLastSavedList = () => {
    if (!lastSavedList) {
      return
    }

    commitListUpdate({
      variables: {
        artworkID: artwork.internalID,
        input: {
          artworkIDs: [artwork.internalID],
          addToCollectionIDs: [lastSavedList.internalID],
          removeFromCollectionIDs: [],
        },
      },
      onCompleted: (data) => {
        const responseOrError = data.artworksCollectionsBatchUpdate?.responseOrError

        // The remembered list was likely deleted — forget it and let the user pick again.
        if ((responseOrError as any)?.mutationError) {
          setLastSavedList(null)
          openSelectArtworkListsForArtworkView()
          return
        }

        refreshOnArtworkSave()
        onCompleted?.(true)

        if (!suppressToasts) {
          toast.savedToLastSavedArtworkList({
            artworkList: lastSavedList,
            onToastPress: openSelectArtworkListsForArtworkView,
          })
        }
      },
      onError: (error) => {
        setLastSavedList(null)
        restOptions.onError?.(error)
      },
    })
  }

  const saveArtworkToLists = () => {
    if (options.saveToDefaultCollectionOnly) {
      saveArtworkToDefaultArtworkList()
      return
    }

    if (artworkListID || isSavedToCustomArtworkLists) {
      openSelectArtworkListsForArtworkView()
      return
    }

    if (
      isLastSavedListEnabled &&
      !isSaved &&
      lastSavedList &&
      lastSavedList.internalID !== SAVED_ARTWORKS_COLLECTION_ID
    ) {
      saveArtworkToLastSavedList()
      return
    }

    saveArtworkToDefaultArtworkList()
  }

  return {
    isSaved,
    saveArtworkToLists,
  }
}

const ArtworkFragment = graphql`
  fragment useSaveArtworkToArtworkLists_artwork on Artwork {
    id
    internalID
    isInAuction
    isSaved
    slug
    title
    date
    artistNames
    preview: image {
      url(version: "square")
    }
    customArtworkLists: collectionsConnection(first: 0, default: false, saves: true) {
      totalCount
    }
  }
`
