import * as React from "react"
import * as Relay from "react-relay"

import { Image, Text, TouchableHighlight } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../../data/colors"
import fonts from "../../../../../data/fonts"
import OpaqueImageView from "../../../OpaqueImageView"

const Container = styled.View`
  borderWidth: 1
  borderColor: ${colors["gray-regular"]}
  flexDirection: row
`

const VerticalLayout = styled.View`
  flex: 1
  flex-direction: column
`

const TextContainer = styled(VerticalLayout)`
  marginLeft: 25
  alignSelf: center
`

const Icon = styled(Image)`
  resize-mode: contain;
  width:40;
  marginTop: 12
  marginLeft: 12
  marginBottom: 12
`

interface Props extends RelayProps {
  onSelected?: () => void
}

export class PDFPreview extends React.Component<Props, any> {
  render() {
    return (
      <TouchableHighlight underlayColor={colors["gray-light"]} onPress={this.props.onSelected}>
        <Container>
          <Icon source={require("../../images/pdf.png")} />
          <TextContainer>
            <Text>{this.props.pdfAttachment.file_name}</Text>
          </TextContainer>
        </Container>
      </TouchableHighlight>
    )
  }
}

export default Relay.createContainer(PDFPreview, {
  fragments: {
    pdfAttachment: () => Relay.QL`
      fragment on AttachmentType {
        file_name
        download_url
      }
    `,
  },
})

interface RelayProps {
  pdfAttachment: {
    file_name?: string
    download_url?: string
  }
}
