import EventEmitter from "events"
import { useEffect } from "react"

export const ArtworkListEvents = new EventEmitter()
ArtworkListEvents.setMaxListeners(20)

const ARTWORK_SAVED_STATE_CHANGED_KEY = "artworkSavedStateChanged"

export const useArtworkSavedStateChanged = (callback: (artworkID: string) => void) => {
  useEffect(() => {
    ArtworkListEvents.addListener(ARTWORK_SAVED_STATE_CHANGED_KEY, callback)

    return () => {
      ArtworkListEvents.removeListener(ARTWORK_SAVED_STATE_CHANGED_KEY, callback)
    }
  }, [])
}

export const dispatchArtworkSavedStateChanged = (artworkID: string) => {
  ArtworkListEvents.emit(ARTWORK_SAVED_STATE_CHANGED_KEY, artworkID)
}
