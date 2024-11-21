import { useSaveArtworkToArtworkListsQuery } from "__generated__/useSaveArtworkToArtworkListsQuery.graphql"
import { useSaveArtworkToArtworkLists_artwork$key } from "__generated__/useSaveArtworkToArtworkLists_artwork.graphql"
import { useArtworkListContext } from "app/Components/ArtworkLists/ArtworkListContext"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkEntity, ResultAction } from "app/Components/ArtworkLists/types"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { SaveArtworkOptions, useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { fetchQuery, graphql, useFragment } from "react-relay"

interface Options extends Pick<SaveArtworkOptions, "onCompleted" | "onError"> {
  artworkFragmentRef: useSaveArtworkToArtworkLists_artwork$key
}

const useSaveArtworkToArtworkListsSavesQuery = graphql`
  query useSaveArtworkToArtworkListsQuery($artworkID: String!) {
    artwork(id: $artworkID) {
      isSavedToList(default: false)
    }
  }
`

export const useSaveArtworkToArtworkLists = (options: Options) => {
  const { artworkFragmentRef, onCompleted, ...restOptions } = options
  const { onSave, dispatch } = useArtworkListsContext()
  const { artworkListID, removedArtworkIDs } = useArtworkListContext()
  const artwork = useFragment(ArtworkFragment, artworkFragmentRef)

  const artworkEntity: ArtworkEntity = {
    id: artwork.id,
    internalID: artwork.internalID,
    title: artwork.title || "",
    year: artwork.date,
    artistNames: artwork.artistNames,
    imageURL: artwork.preview?.url ?? null,
    isInAuction: !!artwork.isInAuction,
  }
  let isSaved = artwork.isSavedToAnyList

  if (artworkListID !== null) {
    const isArtworkRemovedFromArtworkList = removedArtworkIDs.find(
      (artworkID) => artworkID === artwork.internalID
    )
    isSaved = !isArtworkRemovedFromArtworkList
  } else {
    isSaved = artwork.isSavedToAnyList
  }

  const saveArtworkToDefaultArtworkList = useSaveArtwork({
    ...restOptions,
    id: artwork.id,
    internalID: artwork.internalID,
    isSaved: !!artwork.isSavedToAnyList,
    onCompleted,
    optimisticUpdater: (isArtworkSaved, _store, isCalledBefore) => {
      if (isCalledBefore) {
        return
      }

      if (isArtworkSaved) {
        onSave({
          action: ResultAction.SavedToDefaultArtworkList,
          artwork: artworkEntity,
        })

        return
      }

      onSave({
        action: ResultAction.RemovedFromDefaultArtworkList,
        artwork: artworkEntity,
      })
    },
  })

  const openSelectArtworkListsForArtworkView = () => {
    dispatch({
      type: "OPEN_SELECT_ARTWORK_LISTS_VIEW",
      payload: {
        artwork: artworkEntity,
        artworkListID,
      },
    })
  }

  const saveArtworkToLists = async () => {
    if (!artwork.isSavedToAnyList) {
      saveArtworkToDefaultArtworkList()
      return
    }

    if (artworkListID) {
      openSelectArtworkListsForArtworkView()
      return
    }
    const result = await fetchQuery<useSaveArtworkToArtworkListsQuery>(
      getRelayEnvironment(),
      useSaveArtworkToArtworkListsSavesQuery,
      { artworkID: artwork.internalID }
    ).toPromise()

    if (result?.artwork?.isSavedToList) {
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
    isInAuction
    isSavedToAnyList
    slug
    title
    date
    artistNames
    preview: image {
      url(version: "square")
    }
  }
`
