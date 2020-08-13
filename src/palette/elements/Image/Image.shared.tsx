// @ts-ignore
import React from "react"
import styled from "styled-components"
import { Image } from "../../platform/primitives"
import { CleanTag } from "../CleanTag"

import {
  borderRadius,
  BorderRadiusProps,
  height,
  HeightProps,
  maxWidth,
  MaxWidthProps,
  ResponsiveValue,
  space,
  SpaceProps,
  system,
  width,
  WidthProps,
} from "styled-system"

const ratioPadding = system({
  ratio: {
    property: "paddingBottom",
    transform: n => n * 100 + "%",
  },
})

/** Props for web & iOS images */
export interface BaseImageProps {
  /** The url for the image */
  src: string
  /** Apply additional styles to component */
  style?: object
}

export interface ImageProps
  extends BaseImageProps,
    SpaceProps,
    WidthProps,
    HeightProps,
    BorderRadiusProps {}

/**
 * Image component with space, width and height properties
 */
export const BaseImage = styled(CleanTag.as(Image))<ImageProps>`
  ${space};
  ${width};
  ${height};
  ${borderRadius}
`

export interface ResponsiveImageProps
  extends BaseImageProps,
    SpaceProps,
    WidthProps,
    MaxWidthProps {
  ratio?: ResponsiveValue<number>
}

/**
 * An Image component that responsively resizes within its environment
 */
export const BaseResponsiveImage = styled(CleanTag)<ResponsiveImageProps>`
  background: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  ${space};
  ${width};
  ${maxWidth};
  ${props =>
    props.ratio
      ? {
          height: 0,
          ...ratioPadding(props),
        }
      : null};
`
BaseResponsiveImage.defaultProps = {
  width: "100%",
  ratio: 1,
}
