import { themeGet } from "@styled-system/theme-get"
import styled from "styled-components/native"

export const CARD_WIDTH = 270

export const CardRailCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: "transparent",
}))`
  width: ${CARD_WIDTH}px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 1px solid ${themeGet("colors.mono10")};
  overflow: hidden;
`

export const CardRailMetadataContainer = styled.View`
  /* 13px on bottom helps the margin feel visually consistent around all sides */
  margin: 15px 15px 13px;
`
