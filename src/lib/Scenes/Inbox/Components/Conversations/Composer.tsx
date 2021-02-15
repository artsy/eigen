import colors from "lib/data/colors"
import { unsafe_getFeatureFlag } from "lib/store/GlobalStore"
import { Schema, Track, track as _track } from "lib/utils/track"
import { ScreenDimensionsContext } from "lib/utils/useScreenDimensions"
import { Button, color, Flex, themeProps } from "palette"
import React from "react"
import { Dimensions, TextInput, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"
import { InquiryMakeOfferButton } from "./InquiryMakeOfferButton"

const isPad = Dimensions.get("window").width > 700

interface ContainerProps {
  active: boolean
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  border-top-width: 1;
  border-top-color: ${color("black10")};
  padding: 10px;
  background-color: ${(p: ContainerProps) => (p.active ? "white" : colors["gray-light"])};
`

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1;
  ${isPad ? "width: 708; align-self: center;" : ""};
`

interface Props {
  disabled?: boolean
  onSubmit?: (text: string) => any
  value?: string
  artworkID?: string | null
  isOfferableFromInquiry?: boolean | null
}

interface State {
  active: boolean
  text: string | null
}

const track: Track<Props, State, Schema.Entity> = _track as any

@track()
export default class Composer extends React.Component<Props, State> {
  input?: TextInput | any

  statusBarListener = null

  constructor(props: Props) {
    super(props)

    this.state = {
      active: false,
      text: null,
    }
  }

  @track((_props) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationSendReply,
  }))
  submitText() {
    if (this.props.onSubmit && this.state.text) {
      this.props.onSubmit(this.state.text)
      this.setState({ text: null })
    }
  }

  componentDidUpdate() {
    if (this.props.value && !this.state.text) {
      this.setState({ text: this.props.value })
    }
  }

  render() {
    // The TextInput loses its isFocused() callback as a styled component
    const inputStyles = {
      flex: 1,
      fontSize: 13,
      paddingLeft: 10,
      paddingTop: 13,
      paddingBottom: 10,
      paddingRight: 10,
      borderColor: this.state.active ? color("purple100") : "transparent",
      borderWidth: 1,
      fontFamily: themeProps.fontFamily.sans.regular.normal,
    }

    const disableSendButton = !(this.state.text && this.state.text.length) || this.props.disabled

    // GOTCHA: Don't copy this kind of feature flag code if you're working in a functional component. use `useFeatureFlag` instead
    const showInquiryMakeOfferButton =
      unsafe_getFeatureFlag("AROptionsInquiryCheckout") && this.props.isOfferableFromInquiry
    return (
      <ScreenDimensionsContext.Consumer>
        {({ safeAreaInsets }) => (
          <StyledKeyboardAvoidingView behavior="padding" keyboardVerticalOffset={safeAreaInsets.top}>
            {this.props.children}
            <Flex flexDirection="column">
              {!!showInquiryMakeOfferButton && this.props.artworkID != null && (
                <InquiryMakeOfferButton artworkID={this.props.artworkID} />
              )}
              <Container active={this.state.active}>
                <TextInput
                  placeholder={"Type your message"}
                  placeholderTextColor={colors["gray-semibold"]}
                  keyboardAppearance={"dark"}
                  onEndEditing={() => this.setState({ active: false })}
                  onFocus={() => this.setState({ active: this.input.isFocused() })}
                  onChangeText={(text) => this.setState({ text })}
                  ref={(input) => (this.input = input)}
                  style={inputStyles}
                  multiline={true}
                  value={this.state.text || undefined}
                  autoFocus={typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */}
                />
                <TouchableWithoutFeedback disabled={disableSendButton} onPress={this.submitText.bind(this)}>
                  <Button ml="1" disabled={!!disableSendButton}>
                    Send
                  </Button>
                </TouchableWithoutFeedback>
              </Container>
            </Flex>
          </StyledKeyboardAvoidingView>
        )}
      </ScreenDimensionsContext.Consumer>
    )
  }
}
