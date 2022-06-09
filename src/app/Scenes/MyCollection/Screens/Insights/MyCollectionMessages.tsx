import { Message, MessageProps } from "palette"

export const PurchasedArtworkAddedMessage: React.FC<Partial<MessageProps>> = (props) => {
  return (
    <Message
      variant="info"
      title="Your collection is growing"
      text="Based on your purchase history, we’ve added the following works."
      showCloseButton
      {...props}
    />
  )
}

export const SubmittedArtworkAddedMessage: React.FC<Partial<MessageProps>> = (props) => {
  return (
    <Message
      variant="info"
      title="Artwork added to My Collection"
      text="The artwork you submitted for sale has been automatically added."
      showCloseButton
      {...props}
    />
  )
}

export const AddedArtworkWithInsightsMessage: React.FC<Partial<MessageProps>> = (props) => {
  return (
    <Message
      variant="info"
      title="New artwork successfully added"
      text="Insights for your collection have been updated."
      showCloseButton
      {...props}
    />
  )
}

export const AddedArtworkWithoutInsightsMessage: React.FC<Partial<MessageProps>> = (props) => {
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

export const AddedArtworkWithoutAnyCollectionInsightsMessage: React.FC<Partial<MessageProps>> = (
  props
) => {
  return (
    <Message
      variant="info"
      title="New artwork successfully added"
      text="There are currently no insights available on your collection. Insights will be shown here if they become available."
      showCloseButton
      {...props}
    />
  )
}

export const MyCollectionInsightsIncompleteMessage: React.FC<Partial<MessageProps>> = (props) => {
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
