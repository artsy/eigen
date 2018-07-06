type ResponsiveValue<T> = T | Array<T | null>

// space
export type SpaceValue = number | string
export type ResponsiveSpaceValue = ResponsiveValue<SpaceValue>

export interface SpaceProps {
  m?: ResponsiveSpaceValue
  mt?: ResponsiveSpaceValue
  mr?: ResponsiveSpaceValue
  mb?: ResponsiveSpaceValue
  ml?: ResponsiveSpaceValue
  mx?: ResponsiveSpaceValue
  my?: ResponsiveSpaceValue
  p?: ResponsiveSpaceValue
  pt?: ResponsiveSpaceValue
  pr?: ResponsiveSpaceValue
  pb?: ResponsiveSpaceValue
  pl?: ResponsiveSpaceValue
  px?: ResponsiveSpaceValue
  py?: ResponsiveSpaceValue
}

export function space(...args: any[]): any

// width
export type WidthValue = number | string
export type ResponsiveWidthValue = ResponsiveValue<WidthValue>

export interface WidthProps {
  width?: ResponsiveWidthValue
}

// height
export type HeightValue = number | string
export type ResponsiveHeightValue = ResponsiveValue<HeightValue>

export interface HeightProps {
  height?: ResponsiveHeightValue
}

// fontSize
export type FontSizeValue = number | string
export type ResponsiveFontSizeValue = ResponsiveValue<FontSizeValue>

export interface FontSizeProps {
  fontSize?: ResponsiveFontSizeValue
}

export function fontSize(...args: any[]): any

// color
export type ColorValue = string
export type ResponsiveColorValue = ResponsiveValue<ColorValue>

export interface ColorProps {
  color?: ResponsiveColorValue
  bg?: ResponsiveColorValue
}

export function color(...args: any[]): any

// text align
export type TextAlignValue = "left" | "right" | "center" | "justify" | "justify-all" | "start" | "end" | "match-parent"
export type ResponsiveTextAlignValue = ResponsiveValue<TextAlignValue>

export interface TextAlignProps {
  align?: ResponsiveTextAlignValue
}

export function textAlign(...args: any[]): any

// border

export type BorderRadiusValue = number

export interface BorderRadiusProps {
  borderRadius?: BorderRadiusValue
}

export function borderRadius(...args: any[]): any

export type BorderColorValue = string

export interface BorderColorProps {
  borderColor?: BorderColorValue
}

export function borderColor(...args: any[]): any

export type BorderValue = string | number

export interface BorderProps {
  border?: BorderValue
  borderTop?: boolean
  borderRight?: boolean
  borderBottom?: boolean
  borderLeft?: boolean
}

export function borderWidth(...args: any[]): any

// flex
export type AlignItemsValue =
  | "normal"
  | "stretch"
  | "center"
  | "start"
  | "end"
  | "flex-start"
  | "flex-end"
  | "self-start"
  | "self-end"
  | "left"
  | "right"
  | "baseline"
  | "first baseline"
  | "last baseline"
  | "safe center"
  | "unsafe center"
export type ResponsiveAlignItemsValue = ResponsiveValue<AlignItemsValue>

export interface AlignItemsProps {
  alignItems?: ResponsiveAlignItemsValue
}

export function alignItems(...args: any[]): any

export type JustifyContentValue =
  | "center"
  | "start"
  | "end"
  | "flex-start"
  | "flex-end"
  | "left"
  | "right"
  | "baseline"
  | "first baseline"
  | "last baseline"
  | "space-between"
  | "space-around"
  | "space-evenly"
  | "stretch"
  | "safe center"
  | "unsafe center"
export type ResponsiveJustifyContentValue = ResponsiveValue<JustifyContentValue>

export interface JustifyContentProps {
  justifyContent?: ResponsiveJustifyContentValue
}

export function justifyContent(...args: any[]): any

export interface FlexWrapProps {
  wrap?: boolean
}

export function flexWrap(...args: any[]): any

export type FlexDirectionValue = "row" | "row-reverse" | "column" | "column-reverse"
export type ResponsiveFlexDirectionValue = ResponsiveValue<FlexDirectionValue>

export interface FlexDirectionProps {
  flexDirection?: ResponsiveFlexDirectionValue
}

export function flexDirection(...args: any[]): any

export type FlexValue = number
export type ResponsiveFlexValue = ResponsiveValue<FlexValue>

export interface FlexProps {
  flex?: ResponsiveFlexValue
}

export function flex(...args: any[]): any

export type AlignSelfValue =
  | "auto"
  | "normal"
  | "center"
  | "start"
  | "end"
  | "self-start"
  | "self-end"
  | "flex-start"
  | "flex-end"
  | "left"
  | "right"
  | "baseline"
  | "first baseline"
  | "last baseline"
  | "stretch"
  | "safe center"
  | "unsafe center"
export type ResponsiveAlignSelfValue = ResponsiveValue<AlignSelfValue>

export interface AlignSelfProps {
  alignSelf?: ResponsiveAlignSelfValue
}

export function alignSelf(...args: any[]): any

export interface FlexboxProps
  extends AlignItemsProps,
    AlignSelfProps,
    FlexWrapProps,
    FlexDirectionProps,
    FlexProps,
    JustifyContentProps {}
