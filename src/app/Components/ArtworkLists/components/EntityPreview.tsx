import { Box } from "@artsy/palette-mobile"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { FC } from "react"

const ARTWORK_IMAGE_SIZE = 50

interface EntityPreviewProps {
  imageURL: string | null
  size?: number
}

export const EntityPreview: FC<EntityPreviewProps> = ({ imageURL, size = ARTWORK_IMAGE_SIZE }) => {
  if (!imageURL) {
    // TODO: Display NoImage component
    return <Box width={size} height={size} bg="black15" />
  }

  return <OpaqueImageView width={size} height={size} imageURL={imageURL} />
}
