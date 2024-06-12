import { Avatar, Flex } from "@artsy/palette-mobile"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"

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
      <OpaqueImageView
        testID={testID}
        useRawURL={resultType === "Article"}
        imageURL={imageURL}
        height={IMAGE_SIZE}
        width={IMAGE_SIZE}
      />
    </Flex>
  )
}
