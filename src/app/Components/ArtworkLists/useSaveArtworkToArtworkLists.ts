import { useSaveArtworkToArtworkLists_artwork$key } from "__generated__/useSaveArtworkToArtworkLists_artwork.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { SaveArtworkOptions, useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { graphql, useFragment } from "react-relay"

interface Options extends Pick<SaveArtworkOptions, "onCompleted" | "onError" | "contextScreen"> {
  artworkFragmentRef: useSaveArtworkToArtworkLists_artwork$key
}

export const useSaveArtworkToArtworkLists = (options: Options) => {
  const { artworkFragmentRef, onCompleted, ...restOptions } = options
  const isArtworkListsEnabled = useFeatureFlag("AREnableArtworkLists")
  const { artworkListId, isSavedToArtworkList, dispatch } = useArtworkListsContext()
  const toast = useArtworkListToast()
  const artwork = useFragment(ArtworkFragment, artworkFragmentRef)

  const customArtworkListsCount = artwork.customArtworkLists?.totalCount ?? 0
  const isSavedToCustomArtworkLists = customArtworkListsCount > 0
  let isSaved = artwork.isSaved

  if (isArtworkListsEnabled) {
    if (typeof artworkListId !== "undefined") {
      isSaved = isSavedToArtworkList
    } else {
      isSaved = artwork.isSaved ?? isSavedToCustomArtworkLists
    }
  }

  const saveArtworkToDefaultArtworkList = useSaveArtwork({
    ...restOptions,
    id: artwork.id,
    internalID: artwork.internalID,
    isSaved: artwork.isSaved,
    onCompleted: (isArtworkSaved) => {
      onCompleted?.(isArtworkSaved)

      if (isArtworkListsEnabled) {
        if (isArtworkSaved) {
          toast.savedToDefaultArtworkList(openSelectArtworkListsForArtworkView)
          return
        }

        toast.removedFromDefaultArtworkList()
      }
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
    if (!isArtworkListsEnabled) {
      saveArtworkToDefaultArtworkList()
      return
    }

    if (artworkListId || isSavedToCustomArtworkLists) {
      openSelectArtworkListsForArtworkView()
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
