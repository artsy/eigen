import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { ArtworkListsNavigation } from "app/Scenes/ArtworkLists/ArtworkListsNavigation"
import { FC } from "react"

type ArtworkListsFancyModalProps = {
  visible: boolean
  fullScreen?: boolean
  onClose: () => void
}

export const ArtworkListsFancyModal: FC<ArtworkListsFancyModalProps> = ({
  visible,
  fullScreen,
  onClose,
}) => {
  return (
    <FancyModal visible={visible} fullScreen={fullScreen} onBackgroundPressed={onClose}>
      <ArtworkListsNavigation withHeader onClose={onClose} />
    </FancyModal>
  )
}
