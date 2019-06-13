import { Flex, Sans, Separator, Spacer } from "@artsy/palette"
import { Portal } from "lib/Components/Portal"
import React from "react"
import { ImageURISource, PickerIOS, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { animated, config, Spring } from "react-spring/renderprops-native.cjs"
import styled from "styled-components/native"

const AnimatedView = animated(View)

/**
 * From available types seen here: https://palette.artsy.net/#/docs-select
 * TODO: Implement "Large"
 */

// tslint:disable-next-line:no-var-requires
const chevronURI: ImageURISource = require("../../../images/chevron.png")

const BottomSheet = styled(Flex)`
  background-color: white;
  height: 260px;
`

const Chevron = styled.Image`
  width: 7px;
  height: 7px;
`

const Backdrop = styled(Flex)`
  flex: 1;
`

export enum PickerType {
  Small = "Small",
}

export interface PickerOption {
  text: string
  value: string
}

interface Props {
  options: PickerOption[]
  selected?: string
  onSelect: (option: PickerOption) => void
  prompt?: string
  type?: PickerType
}

interface State {
  isOpen: boolean
  isAnimating: boolean
  pendingSelected?: PickerOption
}

export class Picker extends React.Component<Props, State> {
  state: State = {
    isOpen: false,
    isAnimating: false,
  }

  handleOpen = () => {
    const { options, selected } = this.props
    this.setState({
      isOpen: true,
      pendingSelected: options.find(({ value }) => value === selected),
    })
  }

  handleClose = () => {
    this.setState({
      isOpen: false,
      isAnimating: true,
    })
  }

  handleSpringRest = () => {
    this.setState({
      isAnimating: false,
    })
  }

  handleSelect = () => {
    const { pendingSelected } = this.state
    const { selected, onSelect } = this.props
    this.setState({ isOpen: false, isAnimating: true })
    if (pendingSelected && pendingSelected.value !== selected) {
      onSelect(pendingSelected)
    }
  }

  handleValueChange = selectedValue => {
    const { options } = this.props
    const { isOpen } = this.state
    if (isOpen) {
      const idx = options.findIndex(({ value }) => value === selectedValue)
      this.setState({
        pendingSelected: options[idx],
      })
    }
  }

  shouldComponentUpdate(_nextProps, nextState) {
    /**
     * Picker is a controlled component, but we don't want to rerender due to a props/state change
     * in the middle of an animation except for triggering react-spring, otherwise animating is disrupted
     * or skipped alltogether.
     */
    return !nextState.isAnimating || nextState.isOpen !== this.state.isOpen
  }

  renderPicker = () => {
    const { options } = this.props
    const { isOpen, pendingSelected } = this.state
    console.log("hii")
    return (
      <Portal>
        <Spring
          native
          from={{ bottom: -280, progress: 0, opacity: 0 }}
          to={isOpen ? { bottom: 0, progress: 1, opacity: 0.4 } : { bottom: -280, progress: 0, opacity: 0 }}
          onRest={this.handleSpringRest}
          config={{
            ...config.stiff,
            mass: 0.5,
          }}
          precision={1}
        >
          {({ bottom, progress, opacity }) => {
            return (
              <>
                <AnimatedView
                  style={{
                    display: progress.interpolate(p => (p > 0.3 ? "flex" : "none")),
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: opacity.interpolate(o => `rgba(0, 0, 0, ${o})`),
                  }}
                >
                  <TouchableWithoutFeedback onPress={this.handleClose}>
                    <Backdrop />
                  </TouchableWithoutFeedback>
                </AnimatedView>
                <AnimatedView style={{ bottom, position: "absolute", left: 0, right: 0 }}>
                  <BottomSheet justifyContent="center" flexDirection="column">
                    <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
                      <TouchableOpacity onPress={this.handleSelect}>
                        <Flex py={1} px={2} justifyContent="center">
                          <Sans size="3" color="black" weight="medium">
                            Done
                          </Sans>
                        </Flex>
                      </TouchableOpacity>
                    </Flex>
                    <Separator />
                    <PickerIOS
                      selectedValue={pendingSelected ? pendingSelected.value : null}
                      onValueChange={this.handleValueChange}
                    >
                      {options.map(({ text, value }) => (
                        <PickerIOS.Item key={text} label={text} value={value} />
                      ))}
                    </PickerIOS>
                  </BottomSheet>
                </AnimatedView>
              </>
            )
          }}
        </Spring>
      </Portal>
    )
  }

  renderSelect = () => {
    const { selected, options, prompt } = this.props
    const displayPrompt = selected ? options.find(({ value }) => value === selected).text : prompt
    return (
      <TouchableOpacity onPress={this.handleOpen}>
        <Flex flexDirection="row" alignItems="center" justifyContent="center">
          <Sans size="3" weight="medium">
            {displayPrompt}
          </Sans>
          <Spacer m={0.5} />
          <Chevron source={chevronURI} />
        </Flex>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <>
        {this.renderSelect()}
        {this.renderPicker()}
      </>
    )
  }
}
