import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { ModalProps } from "react-native"

interface SavingArtworkModalProps {
  isVisible: boolean
  loadingText: string
}

export const SavingArtworkModal: React.FC<SavingArtworkModalProps & ModalProps> = ({
  loadingText = "",
}) => (
  <FullScreenLoadingImage
    loadingText={loadingText}
    imgSource={require("images/InsightsLoadingImage.webp")}
  />
)
