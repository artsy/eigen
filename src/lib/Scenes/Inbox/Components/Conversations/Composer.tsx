import { Composer_conversation } from "__generated__/Composer_conversation.graphql"
import colors from "lib/data/colors"
import { unsafe_getFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema, Track, track as _track } from "lib/utils/track"
import { ScreenDimensionsContext } from "lib/utils/useScreenDimensions"
import { Button, color, Flex, themeProps } from "palette"
import React from "react"
import { Dimensions, TextInput, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { OpenInquiryModalButton } from "./OpenInquiryModalButton"
import { ReviewOfferButtonFragmentContainer as ReviewOfferButton } from "./ReviewOfferButton"

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
  conversation: Composer_conversation
}

interface State {
  active: boolean
  text: string | null
  hideCTA: boolean
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
      hideCTA: false,
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
    const { conversation } = this.props
    const conversationID = conversation.conversationID!

    const firstItem = conversation?.items?.[0]?.item
    const artwork = firstItem?.__typename === "Artwork" ? firstItem : null
    const { artworkID, isOfferableFromInquiry } = { ...artwork }

    // TODO: assumption is that there will be only 0/1 active (not pending or abandoned) order
    // and we will take the first without worrying about sort/order
    const orders = extractNodes(conversation.orderConnection)
    const inactiveOrderStates = ["PENDING", "ABANDONED"]
    const activeOrder = orders.filter((order) => {
      return !inactiveOrderStates.includes(order.state!)
    })[0]

    const disableSendButton = !(this.state.text && this.state.text.length) || this.props.disabled

    let CTA: JSX.Element | null = null

    const inquiryCheckoutEnabled = unsafe_getFeatureFlag("AROptionsInquiryCheckout")
    if (inquiryCheckoutEnabled && isOfferableFromInquiry) {
      if (activeOrder) {
        CTA = <ReviewOfferButton conversationID={conversationID} order={activeOrder} />
      } else {
        // artworkID is guaranteed to be present if `isOfferableFromInquiry` was present.
        CTA = <OpenInquiryModalButton artworkID={artworkID!} conversationID={conversationID!} />
      }
    }

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

    return (
      <ScreenDimensionsContext.Consumer>
        {({ safeAreaInsets }) => (
          <StyledKeyboardAvoidingView behavior="padding" keyboardVerticalOffset={safeAreaInsets.top}>
            {this.props.children}
            <Flex flexDirection="column">
              {!this.state.active && CTA}
              <Container active={this.state.active}>
                <TextInput
                  placeholder={"Type your message"}
                  placeholderTextColor={colors["gray-semibold"]}
                  keyboardAppearance={"dark"}
                  onEndEditing={() => this.setState({ active: false })}
                  onFocus={() => {
                    console.warn("ON FOCUS", this.state.active)
                    this.setState({ active: this.input.isFocused() })
                  }}
                  onChangeText={(text) => this.setState({ text })}
                  ref={(input) => (this.input = input)}
                  style={inputStyles}
                  multiline={true}
                  value={this.state.text || undefined}
                />
                <TouchableWithoutFeedback disabled={disableSendButton} onPress={this.submitText.bind(this)}>
                  <Button ml={1} disabled={!!disableSendButton}>
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

export const ComposerFragmentContainer = createFragmentContainer(Composer, {
  conversation: graphql`
    fragment Composer_conversation on Conversation {
      conversationID: internalID
      items {
        item {
          __typename
          ... on Artwork {
            artworkID: internalID
            href
            slug
            isOfferableFromInquiry
          }
          ... on Show {
            href
          }
        }
      }
      orderConnection(first: 10, participantType: BUYER) {
        edges {
          node {
            ...ReviewOfferButton_order
            ... on CommerceOrder {
              state
            }
          }
        }
      }
    }
  `,
})
