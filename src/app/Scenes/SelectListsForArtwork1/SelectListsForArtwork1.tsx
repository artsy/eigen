import { ArtworkListsNavigation } from "app/Scenes/ArtworkLists/ArtworkListsNavigation"
import { dismissModal } from "app/system/navigation/navigate"

export const SelectListsForArtwork1 = () => {
  return <ArtworkListsNavigation onClose={() => dismissModal()} />
}
