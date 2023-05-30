import { Flex, FlexProps } from "@artsy/palette-mobile"
import { ArtworkListNoImage } from "app/Components/ArtworkLists/components/ArtworkListNoImage"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { FC } from "react"

interface ArtworkListImageProps extends FlexProps {
  size: number
  imageURL: string | null
}

export const ArtworkListImage: FC<ArtworkListImageProps> = ({ imageURL, size, ...rest }) => {
  return (
    <Flex bg="black5" {...rest}>
      {imageURL ? (
        <OpaqueImageView imageURL={imageURL} width={size} height={size} />
      ) : (
        <ArtworkListNoImage width={size} height={size} borderColor="black15" borderWidth={1} />
      )}
    </Flex>
  )
}
