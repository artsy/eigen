import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { Modal, ModalProps } from "react-native"

interface SavingArtworkModalProps {
  isVisible: boolean
  loadingText: string
}

export const SavingArtworkModal: React.FC<SavingArtworkModalProps & ModalProps> = ({
  isVisible,
  loadingText = "",
  ...rest
}) => (
  <Modal animationType="fade" visible={isVisible} {...rest} transparent statusBarTranslucent>
    <FullScreenLoadingImage
      loadingText={loadingText}
      imgSource={require("images/InsightsLoadingImage.jpg")}
    />
  </Modal>
)
