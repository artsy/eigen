import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Box } from "palette"
import styled from "styled-components/native"

interface ThreeUpImageLayoutProps {
  imageURLs: string[]
}

export const ITEM_HEIGHT = 180

export const ThreeUpImageLayout: React.FC<ThreeUpImageLayoutProps> = ({ imageURLs }) => {
  // Ensure we have an array of exactly 3 URLs, copying over the last image if we have less than 3
  const artworkImageURLs = [null, null, null].reduce((acc: string[], _, i) => {
    return [...acc, imageURLs[i] || acc[i - 1]]
  }, [])

  return (
    <ArtworkImageContainer>
      <ImageView width={ITEM_HEIGHT} height={ITEM_HEIGHT} imageURL={artworkImageURLs[0]} />
      <Division />
      <Box>
        <ImageView
          width={ITEM_HEIGHT / 2}
          height={ITEM_HEIGHT / 2}
          imageURL={artworkImageURLs[1]}
        />
        <Division horizontal />
        <ImageView
          width={ITEM_HEIGHT / 2}
          height={ITEM_HEIGHT / 2}
          imageURL={artworkImageURLs[2]}
        />
      </Box>
    </ArtworkImageContainer>
  )
}

export const ArtworkImageContainer = styled.View`
  width: 100%;
  height: ${ITEM_HEIGHT}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
`

export const Division = styled.View<{ horizontal?: boolean }>`
  border: 1px solid white;
  ${({ horizontal }) => (horizontal ? "height" : "width")}: 1px;
`
