import { ArtworkListNoImage } from "app/Components/ArtworkLists/components/ArtworkListNoImage"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { FC } from "react"

const ARTWORK_IMAGE_SIZE = 50

interface EntityPreviewProps {
  imageURL: string | null
  size?: number
}

export const EntityPreview: FC<EntityPreviewProps> = ({ imageURL, size = ARTWORK_IMAGE_SIZE }) => {
  if (!imageURL) {
    return <ArtworkListNoImage width={size} height={size} />
  }

  return <OpaqueImageView width={size} height={size} imageURL={imageURL} />
}
