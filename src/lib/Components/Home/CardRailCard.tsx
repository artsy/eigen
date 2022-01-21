import { themeGet } from "@styled-system/theme-get"
import styled from "styled-components/native"

export const CARD_WIDTH = 270

export const CardRailCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: "transparent",
}))`
  width: ${CARD_WIDTH}px;
  border: 1px solid ${themeGet("colors.black10")};
  border-radius: 4px;
  overflow: hidden;
`

export const CardRailMetadataContainer = styled.View`
  /* 13px on bottom helps the margin feel visually consistent around all sides */
  margin: 15px 15px 13px;
`
export const CARD_RAIL_ARTWORKS_HEIGHT = 180

export const CardRailDivision = styled.View<{ horizontal?: boolean }>`
  border: 1px solid white;
  ${({ horizontal }: any /* STRICTNESS_MIGRATION */) => (horizontal ? "height" : "width")}: 1px;
`

export const CardRailArtworkImageContainer = styled.View`
  width: 100%;
  height: ${CARD_RAIL_ARTWORKS_HEIGHT}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
`
