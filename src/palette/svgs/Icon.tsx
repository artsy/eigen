import React, { FC } from "react"
import styled from "styled-components"
import {
  compose,
  position,
  PositionProps,
  space,
  SpaceProps,
} from "styled-system"
import { Color } from "../Theme"

export interface IconProps
  extends React.SVGProps<any>,
    SpaceProps,
    PositionProps {
  fill?: Color
  title?: string
}

const iconMixin = compose(
  space,
  position
)

/** Wrapper for icons to include space */
export const Icon = styled.svg<IconProps>`
  position: relative;
  ${iconMixin}
`

Icon.defaultProps = {
  fill: "black100",
  height: "18px",
  width: "18px",
}
/** Compatibility component used to normalize paths between react dom and react native */
export const Path: FC<JSX.IntrinsicElements["path"]> = ({ ...props }) => {
  return <path {...props} />
}

/** Compatibility component used to normalize titles between react dom and react native */
export const Title: FC<JSX.IntrinsicElements["title"]> = ({ ...props }) => {
  return <title {...props} />
}

/** Compatibility component used to normalize svg groups between react dom and react native */
export const G: FC<JSX.IntrinsicElements["g"]> = ({ ...props }) => {
  return <g {...props} />
}

/** Compatibility component used to normalize svg circles between react dom and react native */
export const Circle: FC<JSX.IntrinsicElements["circle"]> = ({ ...props }) => {
  return <circle {...props} />
}

/** Compatibility component used to normalize svg rects between react dom and react native */
export const Rect: FC<JSX.IntrinsicElements["rect"]> = ({ ...props }) => {
  return <rect {...props} />
}
