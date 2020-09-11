import { Text } from "palette"
import React from "react"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

import { FileDownload_attachment } from "__generated__/FileDownload_attachment.graphql"
import { DownloadIcon } from "palette"
import { AttachmentContainer, AttachmentTextContainer } from "./PDFPreview"

interface Props extends AttachmentProps {
  attachment: FileDownload_attachment
}

const downloadFile = (attachment: FileDownload_attachment) => {
  Linking.openURL(attachment.downloadURL)
}

export const FileDownload: React.SFC<Props> = ({ attachment }) => (
  <AttachmentPreview attachment={attachment} onSelected={() => downloadFile(attachment)}>
    <AttachmentContainer>
      <DownloadIcon width="40px" height="40px" mx={1} my={0.5} />
      <AttachmentTextContainer>
        <Text>{attachment.fileName}</Text>
      </AttachmentTextContainer>
    </AttachmentContainer>
  </AttachmentPreview>
)

export const FileDownloadFragmentContainer = createFragmentContainer(FileDownload, {
  attachment: graphql`
    fragment FileDownload_attachment on Attachment {
      fileName
      downloadURL
      ...AttachmentPreview_attachment
    }
  `,
})
