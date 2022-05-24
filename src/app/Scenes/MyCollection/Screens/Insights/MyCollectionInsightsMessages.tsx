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

interface InsightsTabAddedArtworkHasNoInsightsMessageProps {
  onClose: () => void
}
export const InsightsTabAddedArtworkHasNoInsightsMessage: React.FC<
  InsightsTabAddedArtworkHasNoInsightsMessageProps
> = ({ onClose }) => {
  return (
    <Message
      variant="info"
      title="New artwork successfully added"
      text="There are currently no insights available on your collection. Insights will be shown here if they become available."
      onClose={onClose}
      showCloseButton
    />
  )
}
