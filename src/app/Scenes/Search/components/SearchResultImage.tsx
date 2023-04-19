import { Avatar } from "@artsy/palette-mobile"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"

export const IMAGE_SIZE = 40

export const SearchResultImage: React.FC<{
  imageURL: string | null
  resultType: string
  initials?: string | null
  testID?: string
}> = ({ imageURL, resultType, initials, testID }) => {
  const round = resultType === "Artist"

  if (!imageURL && initials) {
    return <Avatar size="xs" initials={initials} />
  }

  return (
    <OpaqueImageView
      testID={testID}
      useRawURL={resultType === "Article"}
      imageURL={imageURL}
      style={{
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: round ? IMAGE_SIZE / 2 : 0,
        overflow: "hidden",
      }}
    />
  )
}
