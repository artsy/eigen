import { Range } from "rc-slider"
import React from "react"
import styled from "styled-components"
import { StyledComponentClass } from "styled-components"
import {
  BorderProps,
  borders,
  space as styledSpace,
  SpaceProps,
} from "styled-system"
import { color, space } from "../../helpers"

export interface SliderProps extends BorderProps, SpaceProps {
  /**
   * Additional CSS class for the root DOM node
   */
  className?: string
  /**
   * allowCross could be set as true to allow those handles to cross.
   */
  allowCross: boolean
  /**
   * If true, handles can't be moved.
   */
  disabled?: boolean
  /**
   * The minimum value of the slider
   */
  min: number
  /**
   * The maximum value of the slider
   */
  max: number
  /**
   * Value to be added or subtracted on each step the slider makes. Must be greater than zero, and max - min should be evenly divisible by the step value.
   * When marks is not an empty object, step can be set to null, to make marks as steps.
   */
  step: number
  /**
   * Set initial positions of handles.
   */
  defaultValue: number[]
  /**
   * onAfterChange will be triggered when ontouchend or onmouseup is triggered.
   */
  onAfterChange?: (minMax: [number, number]) => void
  /**
   * onChange will be triggered while the value of Slider changing.
   */
  onChange?: (minMax: [number, number]) => void
}

const Inner: React.SFC<SliderProps> = props => {
  return <Range {...props} prefixCls={props.className} />
}

/**
 * A slider component that allows to define a range of values. nin and max
 */
export const Slider: StyledComponentClass<SliderProps, any> = styled(Inner)`
  ${borders};
  ${styledSpace};
  box-sizing: border-box;
  position: relative;
  height: ${space(0.5)}px;
  border-radius: ${space(0.5)}px;
  background-color: ${color("black10")};

  &-track {
    position: absolute;
    left: 0;
    top: 0;
    height: ${space(0.5)}px;
    border-radius: ${space(0.5)}px;
    background-color: ${props =>
      props.disabled ? color("black10") : color("black100")};
    z-index: 1;
    transition: background-color 0.25s;
  }

  &-handle {
    position: absolute;
    margin-left: -10px;
    margin-top: -8px;
    top: 0;
    width: ${space(2)}px;
    height: ${space(2)}px;
    cursor: pointer;
    border-radius: 50%;
    border: solid 2px ${color("white100")};
    background-color: ${props =>
      props.disabled ? color("black10") : color("black100")};
    z-index: 2;
    transition: background-color 0.25s;
    pointer-events: ${props => (props.disabled ? "none" : "auto")};

    &:first-child {
      margin-left: ${space(1)}px;
    }

    &:last-child {
      margin-left: -${space(1)}px;
    }

    &:hover {
      border-color: ${color("black100")};
    }
    &-active {
      &:active {
        border-color: ${color("black100")};
        box-shadow: 0 0 5px ${color("black100")};
      }
    }
  }

  &-dot {
    position: absolute;
    bottom: -${space(0.5)}px;
    margin-left: -${space(1)}px;
    width: ${space(2)}px;
    height: ${space(2)}px;
    border: 2px solid ${color("black100")};
    background-color: ${color("black100")};
    cursor: pointer;
    border-radius: 50%;
    vertical-align: middle;
    &:first-child {
      margin-left: -${space(0.5)}px;
    }
    &:last-child {
      margin-left: -${space(0.5)}px;
    }
    &-active {
      border-color: ${color("black60")};
    }
  }
`
