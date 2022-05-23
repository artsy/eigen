import { Message } from "palette"

interface AddedArtworkHasNoInsightsMessageProps {
  onClose: () => void
}

export const AddedArtworkHasNoInsightsMessage: React.FC<AddedArtworkHasNoInsightsMessageProps> = ({
  onClose,
}) => {
  return (
    <Message
      variant="info"
      title="New artwork successfully added"
      text="There are no insights available for this artwork yet."
      onClose={onClose}
      showCloseButton
    />
  )
}
