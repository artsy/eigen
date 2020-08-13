import React from "react"
import styled from "styled-components"

import { BorderBox } from "../BorderBox"
import { Sans } from "../Typography"

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

interface TipPosition {
  left?: number
  right?: number
  center: boolean
}

interface TipProps {
  tipPosition: TipPosition
  width: number
  className?: string
}

const Tip = styled(BorderBox)<TipProps>`
  background: white;
  border: none;
  bottom: 100%;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  left: ${(p: TipProps) =>
    p.tipPosition.left === null ? "auto" : `${p.tipPosition.left}px`};
  right: ${(p: TipProps) =>
    p.tipPosition.right === null ? "auto" : `${p.tipPosition.right}px`};
  margin-bottom: 5px;
  opacity: 0;
  position: absolute;
  text-align: left;
  transform: ${(p: TipProps) =>
    p.tipPosition.center ? "translate(-50%)" : "none"};
  transition: opacity 250ms ease-out;
  width: ${(p: TipProps) => p.width}px;
  pointer-events: none;

  &:hover {
    cursor: default;
  }

  &.active {
    opacity: 1;

    &:hover {
      opacity: 0;
    }
  }
`

export interface TooltipProps {
  content: React.ReactNode
  size: "sm" | "lg"
  width: number
}

/**
 * A tooltip
 */
export class Tooltip extends React.Component<TooltipProps> {
  static defaultProps = {
    size: "lg",
    width: 230,
  }

  state = {
    active: false,
    tipPosition: { left: 0, center: false, right: null },
  }

  private innerWrapper = React.createRef<HTMLDivElement>()

  computeTipPosition = () => {
    let left = 0
    let right = null
    let center = false

    const current = this.innerWrapper.current

    if (current) {
      const clientRect = current.getBoundingClientRect()
      const innerWrapperLeft = clientRect.left
      const innerWrapperRight = clientRect.right
      const innerWrapperWidth = clientRect.width

      left = innerWrapperWidth / 2
      center = true
      const spillOver = this.props.width / 2 - left

      if (spillOver > innerWrapperLeft) {
        center = false
        left = 0
        right = null
      }

      if (spillOver > window.innerWidth - innerWrapperRight) {
        center = false
        left = null
        right = 0
      }
    }

    return {
      center,
      left,
      right,
    }
  }

  componentDidMount() {
    const tipPosition = this.computeTipPosition()
    this.setState({ tipPosition })
  }

  handleClick = () => {
    this.setState({ active: !this.state.active })
  }

  handleMouseOver = () => {
    this.setState({ active: true })
  }

  handleMouseOut = () => {
    this.setState({ active: false })
  }

  render() {
    const content =
      typeof this.props.content === "string"
        ? formattedTip(this.props.content)
        : this.props.content
    return (
      <Wrapper
        onClick={this.handleClick}
        onMouseOut={this.handleMouseOut}
        onMouseOver={this.handleMouseOver}
      >
        <Tip
          className={this.state.active && "active"}
          p={this.props.size === "sm" ? 0.5 : 2}
          tipPosition={this.state.tipPosition}
          width={this.props.width}
        >
          <Sans size={"2"} color="black60">
            {content}
          </Sans>
        </Tip>
        <div ref={this.innerWrapper}>{this.props.children}</div>
      </Wrapper>
    )
  }
}

const formattedTip = (tip: string): string => {
  let substring = tip.substring(0, 300)

  if (substring !== tip) {
    substring += "…"
  }

  return substring
}
