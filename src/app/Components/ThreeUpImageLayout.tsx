import { Box } from "@artsy/palette-mobile"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import styled from "styled-components/native"

interface ThreeUpImageLayoutProps {
  imageURLs: string[]
}

export const LARGE_IMAGE_SIZE = 180
export const SMALL_IMAGE_SIZE = LARGE_IMAGE_SIZE / 2

export const ThreeUpImageLayout: React.FC<ThreeUpImageLayoutProps> = ({ imageURLs }) => {
  // Ensure we have an array of exactly 3 URLs, copying over the last image if we have less than 3
  const artworkImageURLs = [null, null, null].reduce((acc: string[], _, i) => {
    return [...acc, imageURLs[i] || acc[i - 1]]
  }, [])

  return (
    <ArtworkImageContainer>
      <ImageView
        width={LARGE_IMAGE_SIZE}
        height={LARGE_IMAGE_SIZE}
        imageURL={artworkImageURLs[0]}
      />
      <Division />
      <Box>
        <ImageView
          width={SMALL_IMAGE_SIZE}
          height={SMALL_IMAGE_SIZE}
          imageURL={artworkImageURLs[1]}
        />
        <Division horizontal />
        <ImageView
          width={SMALL_IMAGE_SIZE}
          height={SMALL_IMAGE_SIZE}
          imageURL={artworkImageURLs[2]}
        />
      </Box>
    </ArtworkImageContainer>
  )
}

export const ArtworkImageContainer = styled.View`
  width: 100%;
  height: ${LARGE_IMAGE_SIZE}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
`

export const Division = styled.View<{ horizontal?: boolean }>`
  border: 1px solid white;
  ${({ horizontal }) => (horizontal ? "height" : "width")}: 1px;
`
