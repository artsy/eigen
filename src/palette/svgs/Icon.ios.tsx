// @ts-ignore
import React from "react"
import Svg, { SvgProps } from "react-native-svg"
import styled from "styled-components"
import {
  left,
  LeftProps,
  position,
  PositionProps,
  right,
  RightProps,
  space,
  SpaceProps,
  top,
  TopProps,
} from "styled-system"
import { Color } from "../Theme"

// : React.SVGProps<SVGSVGElement>

// tslint:disable-next-line:no-empty-interface
export interface IconProps
  extends SvgProps,
    SpaceProps,
    PositionProps,
    TopProps,
    RightProps,
    LeftProps {
  fill?: Color
  title?: string
}

/** Wrapper for icons to include space */
export const Icon = styled(Svg)<IconProps>`
  position: relative;

  ${space};
  ${top};
  ${right};
  ${left};
  ${position};
`

Icon.defaultProps = {
  fill: "black100",
  height: "18px",
  width: "18px",
}

/** No-op component that exists to maintain api parity with web */
export const Title = (..._props: any[]) => false

export { Path, G, Circle, Rect } from "react-native-svg"
