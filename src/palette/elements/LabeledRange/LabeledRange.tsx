import React from "react"
import styled from "styled-components"
import { space, SpaceProps } from "styled-system"
import { Flex, Sans, Slider, SliderProps } from "../"

interface LabeledRangeProps extends SliderProps {
  label: string
  disabled?: boolean
  disabledText?: string
  formatter?: (min, max, maxIndicator) => string
  unit?: string
}

interface LabeledRangeState {
  min: number
  max: number
}

/** LabeledRange */
export class LabeledRange extends React.Component<
  LabeledRangeProps,
  LabeledRangeState
> {
  static defaultProps = {
    disabled: false,
  }

  state = {
    min: this.props.defaultValue[0],
    max: this.props.defaultValue[1],
  }

  componentWillReceiveProps(newProps: LabeledRangeProps) {
    const [min, max] = newProps.defaultValue
    this.setState({
      min,
      max,
    })
  }

  updateMinMax = ([min, max]) => {
    this.setState({ min, max })
  }

  maxIndicator() {
    return this.props.max === this.state.max ? "+" : ""
  }

  toString() {
    const { min, max } = this.state
    const result = `${min} - ${max}${this.maxIndicator()}`

    if (this.props.unit) {
      return `${result} ${this.props.unit}`
    } else {
      return result
    }
  }

  render() {
    const { formatter, label, disabled, disabledText } = this.props
    const { min, max } = this.state
    const disabledWithText = disabled && disabledText
    return (
      <Flex width="100%" flexDirection="column">
        <Header mt="-6px">
          {disabledWithText ? (
            <Sans size="2" mt={0.3} color="black60">
              {disabledText}
            </Sans>
          ) : (
            <Flex justifyContent="space-between">
              <Sans size="2" color="black100" mt={0.3}>
                {label}
              </Sans>
              <Sans size="2" color="black60" mt={0.3}>
                {formatter
                  ? formatter(min, max, this.maxIndicator())
                  : this.toString()}
              </Sans>
            </Flex>
          )}
        </Header>

        <Flex flexDirection="column" alignItems="left" mt={-1} mb={1}>
          <SliderContainer>
            <Slider
              disabled={this.props.disabled}
              my={1}
              mx={1}
              {...this.props}
              onChange={minMax => {
                this.updateMinMax(minMax)
              }}
            />
          </SliderContainer>
        </Flex>
      </Flex>
    )
  }
}

const Header = styled.div<SpaceProps>`
  cursor: pointer;
  padding-bottom: 16px;
  user-select: none;
  ${space};
`

const SliderContainer = styled.div`
  width: 100%;
`

Header.displayName = "Header"
