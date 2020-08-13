import {
  Col as _Col,
  Container as _Container,
  Row as _Row,
} from "styled-bootstrap-grid"
import styled from "styled-components"
import {
  border,
  BorderProps,
  color,
  ColorProps,
  compose,
  flex,
  FlexProps,
  maxWidth,
  MaxWidthProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  width,
  WidthProps,
} from "styled-system"

/** Outer wrapper when using a grid */
export const Grid = styled(_Container)<
  SpaceProps & MaxWidthProps & BorderProps
>`
  max-width: ${props => props.theme.grid.breakpoints.xl}px;
  ${compose(
    space,
    maxWidth,
    border
  )};
`

/** Grid row */
export const Row = styled(_Row)<ColorProps & SpaceProps>`
  ${compose(
    color,
    space
  )};
`

/** Grid column */
export const Col = styled(_Col)<
  ColorProps & FlexProps & SpaceProps & TextAlignProps & WidthProps
>`
  ${compose(
    color,
    flex,
    space,
    textAlign,
    width
  )}
`

Grid.displayName = "Grid"
Row.displayName = "Row"
Col.displayName = "Col"
