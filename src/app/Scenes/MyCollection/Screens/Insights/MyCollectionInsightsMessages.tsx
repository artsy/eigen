import { Message } from "palette"

interface AddedArtworkHasNoInsightsMessagePreps {
  onClose: () => void
}
export const AddedArtworkHasNoInsightsMessage: React.FC<AddedArtworkHasNoInsightsMessagePreps> = ({
  onClose,
}) => {
  return (
    <Message
      variant="info"
      title="New srtwork successfully added"
      text="There are no insights vailable for his artwork yet."
      onClose={onClose}
      showCloseButton
    />
  )
}
