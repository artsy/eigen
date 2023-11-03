import { Flex, FlexProps } from "@artsy/palette-mobile"
import { ArtworkListNoImage } from "app/Components/ArtworkLists/components/ArtworkListNoImage"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { FC } from "react"

export interface ArtworkListImageProps extends FlexProps {
  size: number
  imageURL: string | null | undefined
  withoutBorder?: boolean
}

export const ArtworkListImage: FC<ArtworkListImageProps> = ({
  imageURL,
  size,
  withoutBorder,
  ...rest
}) => {
  return (
    <Flex bg="black5" {...rest}>
      {imageURL ? (
        <OpaqueImageView imageURL={imageURL} width={size} height={size} />
      ) : (
        <ArtworkListNoImage
          width={size}
          height={size}
          borderColor="black15"
          borderWidth={withoutBorder ? 0 : 1}
        />
      )}
    </Flex>
  )
}
