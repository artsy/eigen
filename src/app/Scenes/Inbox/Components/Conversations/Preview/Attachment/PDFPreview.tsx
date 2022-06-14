import { Flex, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

import { PDFPreview_attachment$data } from "__generated__/PDFPreview_attachment.graphql"

export const AttachmentContainer = styled(Flex)`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const AttachmentTextContainer = styled.View`
  max-width: 66%;
`
const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
  margin-top: 12;
  margin-right: 12;
  margin-bottom: 12;
`

interface Props extends AttachmentProps {
  attachment: PDFPreview_attachment$data
}

export const PDFPreview: React.FC<Props> = ({ attachment, onSelected }) => (
  <AttachmentPreview attachment={attachment} onSelected={onSelected}>
    <AttachmentContainer>
      <Icon source={require("images/pdf.webp")} />
      <AttachmentTextContainer>
        <Text>{attachment.fileName}</Text>
      </AttachmentTextContainer>
    </AttachmentContainer>
  </AttachmentPreview>
)

export default createFragmentContainer(PDFPreview, {
  attachment: graphql`
    fragment PDFPreview_attachment on Attachment {
      fileName
      ...AttachmentPreview_attachment
    }
  `,
})
