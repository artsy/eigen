import { IconProps, Text } from "palette"
import React from "react"
import { Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import AttachmentPreview, { AttachmentProps } from "./AttachmentPreview"

import { FileDownload_attachment$data } from "__generated__/FileDownload_attachment.graphql"
import { DownloadIcon } from "palette"
import styled from "styled-components/native"
import { AttachmentContainer, AttachmentTextContainer } from "./PDFPreview"

export const NoBorderContainer = styled.View`
  flex: 1;
  flex-direction: row;
`

interface Props extends AttachmentProps {
  attachment: FileDownload_attachment$data
  tiny?: boolean
  Icon?: React.FC<IconProps>
}

const downloadFile = (attachment: FileDownload_attachment$data) => {
  Linking.openURL(attachment.downloadURL)
}

export const FileDownload: React.FC<Props> = ({ attachment, tiny, Icon = DownloadIcon }) => {
  const Container = tiny ? NoBorderContainer : AttachmentContainer
  const iconSize = tiny ? "20px" : "40px"
  return (
    <AttachmentPreview attachment={attachment} onSelected={() => downloadFile(attachment)}>
      <Container alignItems="center">
        <Icon width={iconSize} height={iconSize} mr={1} my={0.5} />
        <AttachmentTextContainer>
          <Text variant="xs">{attachment.fileName}</Text>
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
