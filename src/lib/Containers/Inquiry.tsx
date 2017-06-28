import * as React from "react"
import * as Relay from "react-relay"

import { SmallHeadline, MetadataText } from "../Components/Inbox/Typography"

import {
  FlatList,
  ImageURISource,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  ViewProperties,
} from "react-native"

import styled from "styled-components/native"
import colors from "../../data/colors"
import fonts from "../../data/fonts"

import BottomAlignedButton from "../Components/Consignments/Components/BottomAlignedButton"

import ArtworkPreview from "../Components/Inbox/Conversations/ArtworkPreview"

const Container = styled.View`
  flex: 1
  flex-direction: column
`
const Header = styled.View`
  alignSelf: stretch
  margin-top: 10
  flex-direction: column
  margin-bottom: 30
`
// This is really rubbish, but I basically have to create an equally sized element
// on the top right, to get the title in the middle
const PlaceholderView = styled(SmallHeadline)`
  padding-right: 20
  color: white
`
const TitleView = styled.View`
  align-self: center
  align-items: center
  margin-top: 6
`
const HeaderTextContainer = styled.View`
  flex-direction: row
  justify-content: space-between
`
const CancelButton = styled.TouchableOpacity`
  padding-left: 20
`
const Content = styled.View`
  margin-left: 20
  margin-right: 20
`
const InquiryTextInput = styled.TextInput`
  font-size: 16
  margin-top:20
  font-family: ${fonts["garamond-regular"]}
`
const ResponseRate = styled(SmallHeadline)`
  color: ${colors["yellow-bold"]}
  marginTop: 5
`
const ResponseIndicator = styled.View`
  width: 8
  height: 8
  border-radius: 4
  margin-top: 5
  margin-right: 5
  background-color: ${colors["yellow-bold"]}
`
const ResponseRateLine = styled.View`
  flex: 1
  flex-direction: row
  align-items: center
  min-height: 12
  margin-top: 5
`

export class Inquiry extends React.Component<RelayProps, any> {
  render() {
    const placeholderText = this.props.inquiry.partner.contact_message
    const partnerResponseRate = "2 DAY RESPONSE TIME"
    const artwork = this.props.inquiry
    console.log(this.props)
    const partnerName = this.props.inquiry.partner.name

    const doneButtonStyles = {
      backgroundColor: colors["purple-regular"],
      marginBottom: 0,
      paddingTop: 12,
      height: 44,
    }

    return (
      <Container>
        <BottomAlignedButton onPress={} bodyStyle={doneButtonStyles} buttonText="SEND">
          <Header>
            <HeaderTextContainer>
              <CancelButton onPress={}><MetadataText>CANCEL</MetadataText></CancelButton>
              <TitleView>
                <SmallHeadline>{partnerName}</SmallHeadline>
                <ResponseRateLine>
                  <ResponseIndicator />
                  <ResponseRate>{partnerResponseRate}</ResponseRate>
                </ResponseRateLine>
              </TitleView>
              <PlaceholderView>CANCEL</PlaceholderView>
            </HeaderTextContainer>
          </Header>
          <Content>
            <ArtworkPreview artwork={artwork} />
            <InquiryTextInput value={placeholderText} keyboardAppearance={"dark"} multiline={true} autoFocus={true} />
          </Content>
        </BottomAlignedButton>
      </Container>
    )
  }
}

export default Relay.createContainer(Inquiry, {
  fragments: {
    inquiry: () => Relay.QL`
      fragment on Artwork {
        id
        ${ArtworkPreview.getFragment("artwork")}
        partner {
          name
          contact_message
        }
      }
    `,
  },
})

interface RelayProps {
  inquiry: {
    id: string
    partner: {
      name: string
      contact_message: string
    }
  }
}
