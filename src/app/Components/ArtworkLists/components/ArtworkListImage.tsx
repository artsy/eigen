import { FlexProps } from "@artsy/palette-mobile"
import { ArtworkListImageBorder } from "app/Components/ArtworkLists/components/ArtworkListImageBorder"
import { ArtworkListNoImage } from "app/Components/ArtworkLists/components/ArtworkListNoImage"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
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
  if (!imageURL) {
    return <ArtworkListNoImage width={imageWidth} height={imageWidth} {...rest} />
  }

  return (
    <ArtworkListImageBorder {...rest}>
      <OpaqueImageView imageURL={imageURL} width={imageWidth} height={imageWidth} />
    </ArtworkListImageBorder>
  )
}
