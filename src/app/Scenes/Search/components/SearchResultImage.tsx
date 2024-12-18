import { Avatar, Flex } from "@artsy/palette-mobile"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"

export const IMAGE_SIZE = 40

export const SearchResultImage: React.FC<{
  imageURL: string | null | undefined
  resultType: string
  initials?: string | null
  testID?: string
}> = ({ imageURL, resultType, initials, testID }) => {
  const round = resultType === "Artist"

  if (!imageURL && initials) {
    return <Avatar size="xs" initials={initials} />
  }

  return (
    <Flex
      height={IMAGE_SIZE}
      width={IMAGE_SIZE}
      borderRadius={round ? IMAGE_SIZE / 2 : 0}
      overflow="hidden"
    >
      <ImageWithFallback
        testID={testID}
        performResize={!(resultType === "Article")}
        src={imageURL}
        height={IMAGE_SIZE}
        width={IMAGE_SIZE}
      />
    </Flex>
  )
}
