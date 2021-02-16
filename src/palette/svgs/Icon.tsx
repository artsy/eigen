import { PositionProps, SpaceProps } from "palette/helpers"
import Svg, { SvgProps } from "react-native-svg"
import styled from "styled-components"
import { left, position, right, space, top } from "styled-system"
import { Color } from "../Theme"

// tslint:disable-next-line:no-empty-interface
export interface IconProps extends SvgProps, SpaceProps, PositionProps {
  fill?: Color
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

export { Path, G, Circle, Rect, Mask } from "react-native-svg"
