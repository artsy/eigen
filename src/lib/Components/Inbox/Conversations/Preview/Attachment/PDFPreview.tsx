import { Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import colors from "lib/data/colors"

import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

import { PDFPreview_attachment } from "__generated__/PDFPreview_attachment.graphql"

export const AttachmentContainer = styled.View`
  border-width: 1;
  border-color: ${colors["gray-regular"]};
  flex: 1;
  flex-direction: row;
`

export const AttachmentTextContainer = styled.View`
  flex: 1;
  flex-direction: column;
  align-self: center;
`
const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
  margin-top: 12;
  margin-left: 12;
  margin-right: 12;
  margin-bottom: 12;
`

interface Props extends AttachmentProps {
  attachment: PDFPreview_attachment
}

export const PDFPreview: React.SFC<Props> = ({ attachment, onSelected }) => (
  <AttachmentPreview attachment={attachment as any} onSelected={onSelected}>
    <AttachmentContainer>
      <Icon source={require("../../../../../../../images/pdf.png")} />
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
