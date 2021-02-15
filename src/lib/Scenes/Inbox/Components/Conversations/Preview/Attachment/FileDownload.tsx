import { Text } from "palette"
import React from "react"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

import { FileDownload_attachment } from "__generated__/FileDownload_attachment.graphql"
import { DownloadIcon } from "palette"
import styled from "styled-components/native"
import { AttachmentContainer, AttachmentTextContainer } from "./PDFPreview"

export const NoBorderContainer = styled.View`
  flex: 1;
  flex-direction: row;
`
interface Props extends AttachmentProps {
  attachment: FileDownload_attachment
  tiny?: boolean
}

const downloadFile = (attachment: FileDownload_attachment) => {
  Linking.openURL(attachment.downloadURL)
}

export const FileDownload: React.FC<Props> = (props) => {
  const { attachment, tiny } = props
  const Container = tiny ? NoBorderContainer : AttachmentContainer
  const iconSize = tiny ? "20px" : "40px"
  return (
    <AttachmentPreview attachment={attachment} onSelected={() => downloadFile(attachment)}>
      <Container>
        <DownloadIcon width={iconSize} height={iconSize} mx="1" my="0.5" />
        <AttachmentTextContainer>
          <Text variant="caption">{attachment.fileName}</Text>
        </AttachmentTextContainer>
      </Container>
    </AttachmentPreview>
  )
}

export const FileDownloadFragmentContainer = createFragmentContainer(FileDownload, {
  attachment: graphql`
    fragment FileDownload_attachment on Attachment {
      fileName
      downloadURL
      ...AttachmentPreview_attachment
    }
  `,
})
