import * as React from "react"
import { Image, Text, TouchableHighlight } from "react-native"
import { createFragmentContainer, graphql } from "react-relay/compat"
import styled from "styled-components/native"

import colors from "../../../../../../data/colors"
import fonts from "../../../../../../data/fonts"

import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

const Container = styled.View`
  border-width: 1;
  border-color: ${colors["gray-regular"]};
  flex: 1;
  flex-direction: row;
`

const TextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 25;
  align-self: center;
`

const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
  margin-top: 12;
  margin-left: 12;
  margin-bottom: 12;
`

interface Props extends AttachmentProps, RelayProps {}

export const PDFPreview: React.SFC<Props> = ({ attachment, onSelected }) =>
  <AttachmentPreview attachment={attachment as any} onSelected={onSelected}>
    <Container>
      <Icon source={require("../../../../../../../images/pdf.png")} />
      <TextContainer>
        <Text>
          {attachment.file_name}
        </Text>
      </TextContainer>
    </Container>
  </AttachmentPreview>

export default createFragmentContainer(
  PDFPreview,
  graphql`
    fragment PDFPreview_attachment on Attachment {
      file_name
      ...AttachmentPreview_attachment
    }
  `
)

interface RelayProps {
  attachment: {
    file_name?: string
  }
}
