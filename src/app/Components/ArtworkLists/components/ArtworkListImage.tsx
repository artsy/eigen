import { Flex, FlexProps, Image } from "@artsy/palette-mobile"
import { ArtworkListNoImage } from "app/Components/ArtworkLists/components/ArtworkListNoImage"
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
    <Flex bg="mono5" {...rest}>
      {imageURL ? (
        <Image src={imageURL} width={size} height={size} performResize={false} />
      ) : (
        <ArtworkListNoImage
          width={size}
          height={size}
          borderColor="mono15"
          borderWidth={withoutBorder ? 0 : 1}
        />
      )}
    </Flex>
  )
}
