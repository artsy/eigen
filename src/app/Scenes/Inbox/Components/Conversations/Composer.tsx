import { themeGet } from "@styled-system/theme-get"
import { Composer_conversation$data } from "__generated__/Composer_conversation.graphql"
import { Schema, Track, track as _track } from "app/utils/track"
import { Button, ClassTheme, Flex } from "palette"
import React from "react"
import { Keyboard, TextInput, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
import styled from "styled-components/native"
import { ConversationCTAFragmentContainer } from "./ConversationCTA"

interface ContainerProps {
  active: boolean
}

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  border-top-width: 1;
  border-top-color: ${themeGet("colors.black10")};
  padding: 10px;
  background-color: ${(p: ContainerProps) => (p.active ? "white" : themeGet("colors.black5"))};
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
      <ClassTheme>
        {({ color }) => {
          // The TextInput loses its isFocused() callback as a styled component
          const inputStyles = {
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
            <ArtsyKeyboardAvoidingView>
              {this.props.children}
              <Flex flexDirection="column">
                <ConversationCTAFragmentContainer
                  show={!this.state.active}
                  conversation={this.props.conversation}
                />
                <Container active={this.state.active}>
                  <TextInput
                    placeholder="Type your message"
                    placeholderTextColor={color("black60")}
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
            </ArtsyKeyboardAvoidingView>
          )
        }}
      </ClassTheme>
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
