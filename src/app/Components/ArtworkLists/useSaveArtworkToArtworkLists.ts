import { useSaveArtworkToArtworkLists_artwork$key } from "__generated__/useSaveArtworkToArtworkLists_artwork.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { Schema } from "app/utils/track"
import { graphql, useFragment } from "react-relay"

interface Options {
  artworkFragmentRef: useSaveArtworkToArtworkLists_artwork$key
  contextScreen?: Schema.OwnerEntityTypes
}

export const useSaveArtworkToArtworkLists = (options: Options) => {
  const { artworkListId, isSavedToArtworkList, dispatch } = useArtworkListsContext()
  const toast = useArtworkListToast()
  const artwork = useFragment(ArtworkFragment, options.artworkFragmentRef)

  const customArtworkListsCount = artwork.customArtworkLists?.totalCount ?? 0
  const isSavedToCustomArtworkLists = customArtworkListsCount > 0
  let isSaved = artwork.isSaved ?? isSavedToCustomArtworkLists

  // TODO: Add comment about this
  if (typeof artworkListId !== "undefined") {
    isSaved = isSavedToArtworkList
  }

  const saveArtworkToDefaultArtworkList = useSaveArtwork({
    id: artwork.id,
    internalID: artwork.internalID,
    isSaved: artwork.isSaved,
    contextScreen: options.contextScreen,
    onCompleted: () => {
      // TODO: Track event

      // Artwork was unsaved
      if (artwork.isSaved) {
        toast.removedFromDefaultArtworkList()
        return
      }

      toast.savedToDefaultArtworkList(openSelectArtworkListsForArtworkView)
    },
  })

  const openSelectArtworkListsForArtworkView = () => {
    dispatch({
      type: "SET_ARTWORK",
      payload: {
        id: artwork.id,
        internalID: artwork.internalID,
        title: artwork.title!,
        year: artwork.date,
        artistNames: artwork.artistNames,
        imageURL: artwork.preview?.url ?? null,
      },
    })
  }

  const saveArtworkToLists = () => {
    if (artworkListId || isSavedToCustomArtworkLists) {
      console.log("[debug] step 1")
      openSelectArtworkListsForArtworkView()
      return
    }

    console.log("[debug] step 2")
    saveArtworkToDefaultArtworkList()
  }

  console.log("[debug] isSaved", isSaved)

  return {
    isSaved,
    saveArtworkToLists,
  }
}

const ArtworkFragment = graphql`
  fragment useSaveArtworkToArtworkLists_artwork on Artwork {
    id
    internalID
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
