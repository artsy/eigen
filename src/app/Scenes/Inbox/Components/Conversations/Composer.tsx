import { Button, Flex, useColor } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { Composer_conversation$data } from "__generated__/Composer_conversation.graphql"
import { Schema } from "app/utils/track"
import React, { useEffect, useRef, useState } from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
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

const ComposerInner: React.FC<
  React.PropsWithChildren<Props & { forwardedRef?: React.Ref<TextInput> }>
> = ({ disabled, onSubmit, value, conversation, children, forwardedRef }) => {
  const [active, setActive] = useState(false)
  const [text, setText] = useState<string | null>(null)
  const inputRef = useRef<TextInput>(null)
  const tracking = useTracking()
  const color = useColor()
  const submitText = () => {
    tracking.trackEvent({
      action_type: Schema.ActionTypes.Tap,
      action_name: Schema.ActionNames.ConversationSendReply,
    })

    if (onSubmit && text) {
      onSubmit(text)
      setText(null)
      Keyboard.dismiss()
    }
  }

  useEffect(() => {
    if (value && !text) {
      setText(value)
    }
  }, [value, text])

  const disableSendButton = !(text && text.length) || disabled

  const inputStyles = {
    color: color("mono100"),
    flex: 1,
    fontSize: 13,
    paddingLeft: 10,
    paddingTop: 13,
    paddingBottom: 10,
    paddingRight: 10,
    borderColor: active ? color("blue100") : "transparent",
    borderWidth: 1,
    fontFamily: "Unica77LL-Regular",
  }
  // expose ref if provided
  useEffect(() => {
    if (forwardedRef && inputRef.current) {
      if (typeof forwardedRef === "function") {
        forwardedRef(inputRef.current)
      } else if (typeof forwardedRef === "object") {
        ;(forwardedRef as any).current = inputRef.current
      }
    }
  }, [forwardedRef])
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 80}
      style={{ flex: 1, justifyContent: "space-between" }}
    >
      {children}
      <Flex flexDirection="column">
        <ConversationCTAFragmentContainer show={!active} conversation={conversation} />
        <Container active={active}>
          <TextInput
            accessibilityLabel="Text input field"
            placeholder="Type your message"
            placeholderTextColor={color("mono60")}
            keyboardAppearance="dark"
            onEndEditing={() => setActive(false)}
            onFocus={() => setActive(inputRef.current?.isFocused() || false)}
            onChangeText={(text) => setText(text)}
            ref={inputRef}
            style={inputStyles}
            multiline
            value={text || undefined}
          />
          <TouchableWithoutFeedback
            accessibilityRole="button"
            disabled={disableSendButton}
            onPress={submitText}
          >
            <Button ml={1} disabled={!!disableSendButton}>
              Send
            </Button>
          </TouchableWithoutFeedback>
        </Container>
      </Flex>
    </KeyboardAvoidingView>
  )
}

const Composer = React.forwardRef<TextInput, Props>((props, ref) => (
  <ComposerInner {...props} forwardedRef={ref} />
))

export default Composer

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
