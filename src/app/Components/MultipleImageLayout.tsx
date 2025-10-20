import { Box } from "@artsy/palette-mobile"
import themeGet from "@styled-system/theme-get"
import { CARD_WIDTH } from "app/Components/CardRail/CardRailCard"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import styled from "styled-components/native"

export const LARGE_IMAGE_SIZE = (CARD_WIDTH / 3) * 2
export const SMALL_IMAGE_SIZE = LARGE_IMAGE_SIZE / 2

interface MultipleImageLayoutProps {
  imageURLs: string[]
  width?: number
}

export const MultipleImageLayout: React.FC<MultipleImageLayoutProps> = ({
  imageURLs,
  width = CARD_WIDTH,
}) => {
  const largeImageWidth = Math.floor((width * 2) / 3)
  const smallImageWidth = Math.floor(largeImageWidth / 2)

  const oneImageLayout = (
    <ImagesWrapper>
      <ImageWithFallback
        testID="image-1"
        width={width}
        height={largeImageWidth}
        src={imageURLs[0]}
      />
    </ImagesWrapper>
  )

  const twoImageLayout = (
    <ImagesWrapper>
      <ImageWithFallback
        testID="image-1"
        width={width / 2}
        height={largeImageWidth}
        src={imageURLs[0]}
      />
      <Division />
      <ImageWithFallback
        testID="image-2"
        width={width / 2}
        height={largeImageWidth}
        src={imageURLs[1]}
      />
    </ImagesWrapper>
  )

  const threeImageLayout = (
    <ImagesWrapper>
      <ImageWithFallback
        testID="image-1"
        width={largeImageWidth}
        height={largeImageWidth}
        src={imageURLs[0]}
      />
      <Division />
      <Box>
        <ImageWithFallback
          testID="image-2"
          width={smallImageWidth}
          height={smallImageWidth}
          src={imageURLs[1]}
        />
        <Division horizontal />
        <ImageWithFallback
          testID="image-3"
          width={smallImageWidth}
          height={smallImageWidth}
          src={imageURLs[2]}
        />
      </Box>
    </ImagesWrapper>
  )

  switch (imageURLs.length) {
    case 0:
    case 1:
      return oneImageLayout
    case 2:
      return twoImageLayout
    case 3:
      return threeImageLayout
    default:
      return threeImageLayout
  }
}

export const Division = styled.View<{ horizontal?: boolean }>`
  border: 1px solid ${themeGet("colors.mono0")};
  ${({ horizontal }: { horizontal?: boolean }) => (horizontal ? "height" : "width")}: 1px;
`

const ImagesWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  max-height: ${LARGE_IMAGE_SIZE}px;
`
