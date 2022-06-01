import { Message, MessageProps } from "palette"

export const AddedArtworkHasNoInsightsMessage: React.FC<Partial<MessageProps>> = (props) => {
  return (
    <Message
      variant="info"
      title="New artwork successfully added"
      text="There are no insights available for this artwork yet."
      showCloseButton
      {...props}
    />
  )
}

export const SomeArtworksHaveInsightsMessage: React.FC<Partial<MessageProps>> = (props) => {
  return (
    <Message
      variant="info"
      title="Why don’t I see insights for all my artworks?"
      text="Insights are market data on artists you collect. Not all artists in your collection currently have insights available."
      showCloseButton
      testID="artworks-have-no-insights-message"
      {...props}
    />
  )
}
