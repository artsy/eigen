import { useArtworkSavedStateChanged } from "app/Components/ArtworkLists/ArtworkListEvents"
import { FC, createContext, useCallback, useContext, useState } from "react"

interface ArtworkListContextState {
  artworkListID: string | null
  removedArtworkIDs: string[]
}

interface ArtworkListProviderProps {
  artworkListID: string
}

const ArtworkListContext = createContext<ArtworkListContextState>({
  artworkListID: null,
  removedArtworkIDs: [],
})

// TODO: remove this one in favor of ArtworkListStore
export const ArtworkListProvider: FC<React.PropsWithChildren<ArtworkListProviderProps>> = ({
  artworkListID,
  children,
}) => {
  const [removedArtworkIDs, setRemovedArtworkIDs] = useState<string[]>([])

  const callback = useCallback((artworkID: string) => {
    setRemovedArtworkIDs((prevArtworkIDs) => {
      if (prevArtworkIDs.includes(artworkID)) {
        return prevArtworkIDs.filter((prevArtworkID) => prevArtworkID !== artworkID)
      }

      return [...prevArtworkIDs, artworkID]
    })
  }, [])

  useArtworkSavedStateChanged(callback)

  return (
    <ArtworkListContext.Provider value={{ artworkListID, removedArtworkIDs }}>
      {children}
    </ArtworkListContext.Provider>
  )
}

export const useArtworkListContext = () => {
  return useContext(ArtworkListContext)
}
