import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { ArtworkListsNavigation } from "app/Scenes/ArtworkLists/ArtworkListsNavigation"
import { FC } from "react"

type ArtworkListsFancyModalProps = {
  visible: boolean
  onClose: () => void
}

export const ArtworkListsFancyModal: FC<ArtworkListsFancyModalProps> = ({ visible, onClose }) => {
  return (
    <FancyModal visible={visible} onBackgroundPressed={onClose}>
      <ArtworkListsNavigation onClose={onClose} />
    </FancyModal>
  )
}
