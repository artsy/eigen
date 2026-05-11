import { Flex, Text } from "@artsy/palette-mobile"
import { PDFPreview_attachment$data } from "__generated__/PDFPreview_attachment.graphql"
import { useMediaPreview } from "app/Scenes/Inbox/hooks/useMediaPreview"
import React from "react"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import AttachmentPreview from "./AttachmentPreview"

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
  width: 40px;
  margin-top: 12px;
  margin-right: 12px;
  margin-bottom: 12px;
`

interface Props {
  attachment: PDFPreview_attachment$data
  url: string
  mimeType: string
  cacheKey: string
}

export const PDFPreview: React.FC<Props> = ({ attachment, url, mimeType, cacheKey }) => {
  const { openPreview } = useMediaPreview(url, mimeType, cacheKey)

  return (
    <AttachmentPreview attachment={attachment} onSelected={openPreview}>
      <AttachmentContainer>
        <Icon source={require("images/pdf.webp")} />
        <AttachmentTextContainer>
          <Text>{attachment.fileName}</Text>
        </AttachmentTextContainer>
      </AttachmentContainer>
    </AttachmentPreview>
  )
}

export default createFragmentContainer(PDFPreview, {
  attachment: graphql`
    fragment PDFPreview_attachment on Attachment {
      fileName
      ...AttachmentPreview_attachment
    }
  `,
})
