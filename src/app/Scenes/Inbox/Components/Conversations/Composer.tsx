import { Button, Flex } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { Composer_conversation$data } from "__generated__/Composer_conversation.graphql"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { Schema, Track, track as _track } from "app/utils/track"
import React from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { ConversationCTAFragmentContainer } from "./ConversationCTA"

interface ContainerProps {
  active: boolean
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  border-top-width: 1px;
  border-top-color: ${themeGet("colors.mono10")};
  border-bottom-color: ${themeGet("colors.mono10")};
  border-bottom-width: 1px;
  padding: 10px;
  background-color: ${(p: ContainerProps) => (p.active ? "mono0" : themeGet("colors.mono5"))};
`

interface Props {
  disabled?: boolean
  onSubmit?: (text: string) => any
  value?: string
  conversation: Composer_conversation$data
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
      Keyboard.dismiss()
    }
  }

  componentDidUpdate() {
    if (this.props.value && !this.state.text) {
      this.setState({ text: this.props.value })
    }
  }

  render() {
    const disableSendButton = !(this.state.text && this.state.text.length) || this.props.disabled

    return (
      <ThemeAwareClassTheme>
        {({ color }) => {
          // The TextInput loses its isFocused() callback as a styled component
          const inputStyles = {
            color: color("mono100"),
            flex: 1,
            fontSize: 13,
            paddingLeft: 10,
            paddingTop: 13,
            paddingBottom: 10,
            paddingRight: 10,
            borderColor: this.state.active ? color("blue100") : "transparent",
            borderWidth: 1,
            fontFamily: "Unica77LL-Regular",
          }
          return (
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 80}
              style={{ flex: 1, justifyContent: "space-between" }}
            >
              {this.props.children}
              <Flex flexDirection="column">
                <ConversationCTAFragmentContainer
                  show={!this.state.active}
                  conversation={this.props.conversation}
                />
                <Container active={this.state.active}>
                  <TextInput
                    placeholder="Type your message"
                    placeholderTextColor={color("mono60")}
                    keyboardAppearance="dark"
                    onEndEditing={() => this.setState({ active: false })}
                    onFocus={() => this.setState({ active: this.input.isFocused() })}
                    onChangeText={(text) => this.setState({ text })}
                    ref={(input) => (this.input = input)}
                    style={inputStyles}
                    multiline
                    value={this.state.text || undefined}
                  />
                  <TouchableWithoutFeedback
                    disabled={disableSendButton}
                    onPress={this.submitText.bind(this)}
                  >
                    <Button ml={1} disabled={!!disableSendButton}>
                      Send
                    </Button>
                  </TouchableWithoutFeedback>
                </Container>
              </Flex>
            </KeyboardAvoidingView>
          )
        }}
      </ThemeAwareClassTheme>
    )
  }
}

export const ComposerFragmentContainer = createFragmentContainer(Composer, {
  conversation: graphql`
    fragment Composer_conversation on Conversation {
      ...ConversationCTA_conversation
      items {
        item {
          __typename
          ... on Artwork {
            href
            slug
          }
          ... on Show {
            href
          }
        }
      }
    }
  `,
})
