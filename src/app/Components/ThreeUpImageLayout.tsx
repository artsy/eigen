import { Box, Flex } from "@artsy/palette-mobile"
import themeGet from "@styled-system/theme-get"
import { CARD_WIDTH } from "app/Components/CardRail/CardRailCard"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import styled from "styled-components/native"

export const LARGE_IMAGE_SIZE = (CARD_WIDTH / 3) * 2
export const SMALL_IMAGE_SIZE = LARGE_IMAGE_SIZE / 2

interface ThreeUpImageLayoutProps {
  imageURLs: string[]
  width?: number
}

export const ThreeUpImageLayout: React.FC<ThreeUpImageLayoutProps> = ({
  imageURLs,
  width = CARD_WIDTH,
}) => {
  // Ensure we have an array of exactly 3 URLs, copying over the last image if we have less than 3
  const artworkImageURLs = [null, null, null].reduce((acc: string[], _, i) => {
    return [...acc, imageURLs[i] || acc[i - 1]]
  }, [])

  const largeImageWidth = Math.floor((width * 2) / 3)
  const smallImageWidth = Math.floor(largeImageWidth / 2)

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      overflow="hidden"
      maxHeight={largeImageWidth}
    >
      <ImageWithFallback
        testID="image-1"
        width={largeImageWidth}
        height={largeImageWidth}
        src={artworkImageURLs[0]}
      />
      <Division />
      <Box>
        <ImageWithFallback
          testID="image-2"
          width={smallImageWidth}
          height={smallImageWidth}
          src={artworkImageURLs[1]}
        />
        <Division horizontal />
        <ImageWithFallback
          testID="image-3"
          width={smallImageWidth}
          height={smallImageWidth}
          src={artworkImageURLs[2]}
        />
      </Box>
    </Flex>
  )
}

export const Division = styled.View<{ horizontal?: boolean }>`
  border: 1px solid ${themeGet("colors.mono0")};
  ${({ horizontal }: { horizontal?: boolean }) => (horizontal ? "height" : "width")}: 1px;
`
