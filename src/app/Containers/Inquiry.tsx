import { themeGet } from "@styled-system/theme-get"
import { Inquiry_artwork$data } from "__generated__/Inquiry_artwork.graphql"
import { InquiryQuery } from "__generated__/InquiryQuery.graphql"
import { dismissModal } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import ArtworkPreview from "app/Scenes/Inbox/Components/Conversations/Preview/ArtworkPreview"
import { MetadataText, SmallHeadline } from "app/Scenes/Inbox/Components/Typography"
import { getCurrentEmissionState, unsafe__getEnvironment } from "app/store/GlobalStore"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Box, Button, Separator, Spacer } from "palette"
import React from "react"
import { Dimensions, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
import styled from "styled-components/native"
import { Schema, Track, track as _track } from "../utils/track"

const isPad = Dimensions.get("window").width > 700

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: white;
`
const Header = styled.View`
  align-self: stretch;
  margin-top: 30;
  flex-direction: column;
  margin-bottom: 30;
`
// This is really rubbish, but I basically have to create an equally sized element
// on the top right, to get the title in the middle
const PlaceholderView = styled(SmallHeadline)`
  padding-right: 20;
  color: white;
`
const TitleView = styled.View`
  align-self: center;
  align-items: center;
  margin-top: 6;
`
const PartnerName = styled(SmallHeadline)`
  font-size: 12;
`
const HeaderTextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`
const CancelButton = styled.TouchableOpacity`
  padding-left: 20;
`

const Content = styled.View`
  margin-left: 20;
  margin-right: 20;
  align-self: ${isPad ? "center" : "stretch"};
  ${isPad ? "width: 472;" : ""};
`

const InquiryTextInput = styled.TextInput`
  font-size: 16;
  margin-top: 20;
  font-family: "ReactNativeAGaramondPro-Regular";
`
const ResponseRate = styled(SmallHeadline)`
  color: ${themeGet("colors.yellow100")};
  margin-top: 5;
`
// TODO: Uncomment when use is uncommented in code below
// const ResponseIndicator = styled.View`
//   width: 8;
//   height: 8;
//   border-radius: 4;
//   margin-top: 5;
//   margin-right: 5;
//   background-color: ${colors["yellow-bold"]};
// `

const ResponseRateLine = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  min-height: 12;
  margin-top: 5;
`

export interface BottomAlignedProps extends React.Props<JSX.Element> {
  onPress: () => void
  buttonText: string
  disabled?: boolean
  verticalOffset?: number
  showSeparator?: boolean
}

export const BottomAlignedButton: React.FC<BottomAlignedProps> = ({
  buttonText,
  onPress,
  children,
  disabled,
  showSeparator = true,
}) => (
  <ArtsyKeyboardAvoidingView>
    <View key="space-eater" style={{ flexGrow: 1 }}>
      {children}
    </View>
    {!!showSeparator && <Separator key="separator" />}
    <Spacer mb={1} />
    <Box px={2}>
      <Button
        accessibilityLabel={buttonText}
        block
        width="100%"
        onPress={onPress}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </Box>
    <Spacer mb={1} />
  </ArtsyKeyboardAvoidingView>
)

interface Props {
  artwork: Inquiry_artwork$data
}

interface State {
  text: string | null
  sending: boolean
}

const track: Track<Props, State, Schema.Entity> = _track as any

@track()
export class Inquiry extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      text: this.props.artwork.contact_message,
      sending: false,
    }
  }

  @track((props) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.InquiryCancel,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork.internalID,
    owner_slug: props.artwork.slug,
  }))
  cancelModal() {
    dismissModal()
  }

  @track((props) => ({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork.internalID,
    owner_slug: props.artwork.slug,
  }))
  inquirySent() {
    dismissModal()
  }

  @track((props) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork.internalID,
    owner_slug: props.artwork.slug,
  }))
  sendInquiry() {
    const { authenticationToken, userAgent } = getCurrentEmissionState()
    const gravityURL = unsafe__getEnvironment().gravityURL
    // Using setState to trigger re-render for the button
    this.setState(() => ({ sending: true }))
    fetch(gravityURL + "/api/v1/me/artwork_inquiry_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ACCESS-TOKEN": authenticationToken,
        "User-Agent": userAgent,
      },
      body: JSON.stringify({
        artwork: this.props.artwork.slug,
        message: this.state.text,
      }),
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          this.inquirySent()
        } else {
          throw new Error(await response.text())
        }
      })
      .catch((error) => {
        this.sendFailed(error)
      })
  }

  @track((props) => ({
    action_type: Schema.ActionTypes.Fail,
    action_name: Schema.ActionNames.InquirySend,
    owner_type: Schema.OwnerEntityTypes.Artwork,
    owner_id: props.artwork.internalID,
    owner_slug: props.artwork.slug,
  }))
  sendFailed(error: any) {
    this.setState(() => ({ sending: false }))
    console.error(error)
  }

  render() {
    const message = this.state.text
    const partnerResponseRate = " " // currently hardcoded for alignment
    const artwork = this.props.artwork
    const partnerName = this.props.artwork.partner?.name
    const buttonText = this.state.sending ? "Sending..." : "Send"

    return (
      <Container>
        <BottomAlignedButton
          onPress={this.sendInquiry.bind(this)}
          buttonText={buttonText}
          disabled={this.state.sending}
        >
          <Header>
            <HeaderTextContainer>
              <CancelButton onPress={this.cancelModal.bind(this)}>
                <MetadataText>Cancel</MetadataText>
              </CancelButton>
              <TitleView>
                <PartnerName>{partnerName}</PartnerName>
                <ResponseRateLine>
                  {/* <ResponseIndicator /> */}
                  <ResponseRate>{partnerResponseRate}</ResponseRate>
                </ResponseRateLine>
              </TitleView>
              <PlaceholderView>Cancel</PlaceholderView>
            </HeaderTextContainer>
          </Header>
          <Content>
            <ArtworkPreview artwork={artwork as any} />
            <InquiryTextInput
              value={message || undefined}
              keyboardAppearance="dark"
              multiline
              autoFocus={
                typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */
              }
              onEndEditing={() => {
                this.setState({ text: null })
              }}
              onChangeText={(text) => this.setState({ text })}
            />
          </Content>
        </BottomAlignedButton>
      </Container>
    )
  }
}

export const InquiryFragmentContainer = createFragmentContainer(Inquiry, {
  artwork: graphql`
    fragment Inquiry_artwork on Artwork {
      slug
      internalID
      contact_message: contactMessage
      partner {
        name
      }
      ...ArtworkPreview_artwork
    }
  `,
})

export const InquiryQueryRenderer: React.FC<{ artworkID: string }> = ({ artworkID }) => {
  return (
    <QueryRenderer<InquiryQuery>
      environment={defaultEnvironment}
      query={graphql`
        query InquiryQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            ...Inquiry_artwork
          }
        }
      `}
      variables={{
        artworkID,
      }}
      render={renderWithLoadProgress(InquiryFragmentContainer)}
    />
  )
}
