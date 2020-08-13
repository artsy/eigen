import React from "react"
import { Flex, FlexProps } from "../Flex"
import { RadioProps } from "../Radio"
import { Sans } from "../Typography"

/**
 * Spec: zpl.io/bAvnwlB
 */

export interface RadioGroupProps extends FlexProps {
  /** Ability to deselect the selection */
  deselectable?: boolean
  /** Disable interactions */
  disabled?: boolean
  /** Text to display when disabled */
  disabledText?: string
  /** Callback when selected */
  onSelect?: (selectedOption: string) => void
  /** Default value of radio button */
  defaultValue?: string
  /** Child <Radio /> elements */
  children: Array<React.ReactElement<RadioProps>>
}

interface RadioGroupState {
  selectedOption: string | null
}

/**
 * A stateful collection of Radio buttons
 *
 * Spec: zpl.io/bAvnwlB
 */
export class RadioGroup extends React.Component<
  RadioGroupProps,
  RadioGroupState
> {
  state = {
    selectedOption: this.props.defaultValue || null,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        selectedOption: this.props.defaultValue,
      })
    }
  }

  onSelect = ({ value }) => {
    // After state update, call back up the tree with the latest state
    const update = () => {
      if (this.props.onSelect) {
        this.props.onSelect(this.state.selectedOption)
      }
    }

    if (this.props.deselectable) {
      if (this.state.selectedOption === value) {
        this.setState(
          {
            selectedOption: null,
          },
          update
        )
        return
      }
    }

    this.setState({ selectedOption: value }, update)
  }

  renderRadioButtons() {
    return React.Children.map(
      this.props.children,
      (child: React.ReactElement<RadioProps>) => {
        return React.cloneElement(child, {
          disabled:
            child.props.disabled !== undefined
              ? child.props.disabled
              : this.props.disabled,
          onSelect: child.props.onSelect
            ? selected => {
                this.onSelect(selected)
                child.props.onSelect(selected)
              }
            : this.onSelect,
          // FIXME: Throw an error `child.props.selected' is set once we enable the dev code elimination.
          selected: this.state.selectedOption === child.props.value,
        })
      }
    )
  }

  render() {
    const {
      disabled,
      disabledText,
      onSelect,
      defaultValue,
      children,
      ...others
    } = this.props
    return (
      <Flex flexDirection="column" {...others}>
        {disabled && disabledText && (
          <Sans size="2" my={0.3} color="black60">
            {disabledText}
          </Sans>
        )}
        {this.renderRadioButtons()}
      </Flex>
    )
  }
}
