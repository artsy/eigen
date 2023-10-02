import {
  ArtworkListImage,
  ArtworkListImageProps,
} from "app/Components/ArtworkLists/components/ArtworkListImage"
import { FC } from "react"

const PREVIEW_SIZE = 50

type ArtworkListImagePreviewProps = Omit<ArtworkListImageProps, "size">

export const ArtworkListImagePreview: FC<ArtworkListImagePreviewProps> = (props) => {
  return <ArtworkListImage size={PREVIEW_SIZE} withoutBorder {...props} />
}
