import { Box, Button, Separator, Spacer } from "@artsy/palette"
import React from "react"
import { KeyboardAvoidingView, NativeModules, StatusBarIOS, View } from "react-native"

export interface BottomAlignedProps extends React.Props<JSX.Element> {
  onPress: () => void
  buttonText: string
  disabled?: boolean
  verticalOffset?: number
}

const { StatusBarManager } = NativeModules

export class BottomAlignedButton extends React.Component<BottomAlignedProps> {
  state = { statusBarHeight: 0 }
  statusBarListener = null

  componentDidMount() {
    if (StatusBarManager && StatusBarManager.getHeight) {
      StatusBarManager.getHeight(statusBarFrameData => {
        this.setState({ statusBarHeight: statusBarFrameData.height })
      })
      this.statusBarListener = StatusBarIOS.addListener("statusBarFrameWillChange", statusBarData => {
        this.setState({ statusBarHeight: statusBarData.frame.height })
      })
    }
  }

  componentWillUnmount() {
    this.statusBarListener.remove()
  }
  render() {
    const { buttonText, onPress, children, disabled } = this.props
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={this.state.statusBarHeight} style={{ flex: 1 }}>
        <View key="space-eater" style={{ flexGrow: 1 }}>
          {children}
        </View>
        <Separator key="separator" />
        <Spacer mb={1} />
        <Box px={2}>
          <Button block width="100%" onPress={onPress} disabled={disabled}>
            {buttonText}
          </Button>
        </Box>
        <Spacer mb={1} />
      </KeyboardAvoidingView>
    )
  }
}
