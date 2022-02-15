import { ArtworkAttributionClassFAQQueryRenderer } from "lib/Scenes/ArtworkAttributionClassFAQ"
import { ArtworkMediumQueryRenderer } from "lib/Scenes/ArtworkMedium"
import { ArtworkSubmissionStatusFAQ } from "lib/Scenes/MyCollection/Screens/Artwork/ArtworkSubmissionStatusFAQ"
import { Text } from "palette"
import React from "react"

interface Props {
  component: string
  artworkSlug: any
}

export const InfoModalScreen: React.FC<Props> = ({ component, artworkSlug }) => {
  const returnComponent = () => {
    switch (component) {
      case "ArtworkSubmissionStatusFAQ":
        return <ArtworkSubmissionStatusFAQ />
      case "ArtworkMedium":
        return artworkSlug && <ArtworkMediumQueryRenderer artworkID={artworkSlug} />
      case "ArtworkAttributionClassFAQ":
        return <ArtworkAttributionClassFAQQueryRenderer />
      default:
        return <Text>Something is off</Text>
    }
  }
  return returnComponent()
}
