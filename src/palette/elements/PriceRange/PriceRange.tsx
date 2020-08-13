import React from "react"
import { LabeledRange, SliderProps } from "../"

interface PriceRangeProps extends SliderProps {
  currency?: string
  disabled?: boolean
  disabledText?: string
}

/** PriceRange */
export class PriceRange extends React.Component<PriceRangeProps> {
  static defaultProps = {
    currency: "USD",
    disabled: false,
  }

  formatter(min, max, maxIndicator) {
    const formatOptions = {
      style: "currency",
      currency: this.props.currency,
      minimumFractionDigits: 0,
    }

    const minPrice = min.toLocaleString("en-US", formatOptions)
    const maxPrice = max.toLocaleString("en-US", formatOptions)

    return `${minPrice} - ${maxPrice}${maxIndicator}`
  }

  render() {
    return (
      <LabeledRange
        formatter={this.formatter.bind(this)}
        label={this.props.currency}
        disabled={this.props.disabled}
        disabledText={this.props.disabledText}
        {...this.props}
      />
    )
  }
}
