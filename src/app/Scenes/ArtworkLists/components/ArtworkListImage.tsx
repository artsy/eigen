import { FlexProps } from "@artsy/palette-mobile"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { ArtworkListImageBorder } from "app/Scenes/ArtworkLists/components/ArtworkListImageBorder"
import { FC } from "react"

interface ArtworkListImageProps {
  imageURL: string | null
  imageWidth: number
}

export const ArtworkListImage: FC<ArtworkListImageProps & FlexProps> = ({
  imageURL,
  imageWidth,
  ...rest
}) => {
  return (
    <ArtworkListImageBorder {...rest}>
      <OpaqueImageView imageURL={imageURL} width={imageWidth} height={imageWidth} />
    </ArtworkListImageBorder>
  )
}
